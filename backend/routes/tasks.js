const express = require("express")
const axios = require("axios")
const { authenticateToken, authorizeRoles, canAccessProject } = require("../middleware/auth")
const { sendWhatsAppMessage } = require("../services/whatsapp")

const router = express.Router()

// Get tasks with filtering
router.get("/", authenticateToken, async (req, res) => {
  try {
    const { project_id, assignee_id, status, priority, due_date_from, due_date_to, page = 1, limit = 20 } = req.query

    let query = `
      SELECT t.*, 
             CONCAT(assignee.first_name, ' ', assignee.last_name) as assignee_name,
             CONCAT(creator.first_name, ' ', creator.last_name) as created_by_name,
             p.name as project_name
      FROM tasks t
      LEFT JOIN users assignee ON t.assignee_id = assignee.id
      LEFT JOIN users creator ON t.created_by = creator.id
      LEFT JOIN projects p ON t.project_id = p.id
    `

    const params = []
    const conditions = []

    // Role-based filtering
    if (req.user.role === "client") {
      conditions.push("p.client_id = ?")
      params.push(req.user.id)
    } else if (req.user.role === "team_member") {
      conditions.push("(t.assignee_id = ? OR pm.user_id = ?)")
      params.push(req.user.id, req.user.id)
      query = query.replace(
        "FROM tasks t",
        `
        FROM tasks t
        LEFT JOIN project_members pm ON t.project_id = pm.project_id
      `,
      )
    }

    // Additional filters
    if (project_id) {
      conditions.push("t.project_id = ?")
      params.push(project_id)
    }

    if (assignee_id) {
      conditions.push("t.assignee_id = ?")
      params.push(assignee_id)
    }

    if (status) {
      conditions.push("t.status = ?")
      params.push(status)
    }

    if (priority) {
      conditions.push("t.priority = ?")
      params.push(priority)
    }

    if (due_date_from) {
      conditions.push("t.due_date >= ?")
      params.push(due_date_from)
    }

    if (due_date_to) {
      conditions.push("t.due_date <= ?")
      params.push(due_date_to)
    }

    if (conditions.length > 0) {
      query += " WHERE " + conditions.join(" AND ")
    }

    query += " ORDER BY t.created_at DESC"

    // Pagination
    const offset = (page - 1) * limit
    query += " LIMIT ? OFFSET ?"
    params.push(Number.parseInt(limit), offset)

    const [tasks] = await req.db.execute(query, params)
    res.json({ tasks })
  } catch (error) {
    console.error("Get tasks error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Create new task with optional Git branch creation
router.post("/", authenticateToken, authorizeRoles("admin", "project_manager"), async (req, res) => {
  try {
    const {
      title,
      description,
      project_id,
      assignee_id,
      priority = "medium",
      due_date,
      estimated_hours,
      create_git_branch = false,
    } = req.body

    if (!title || !project_id) {
      return res.status(400).json({ message: "Title and project ID are required" })
    }

    // Verify project access
    const [projects] = await req.db.execute("SELECT github_repo_url FROM projects WHERE id = ?", [project_id])

    if (projects.length === 0) {
      return res.status(404).json({ message: "Project not found" })
    }

    let gitBranch = null

    // Create Git branch if requested and repo URL exists
    if (create_git_branch && projects[0].github_repo_url) {
      try {
        gitBranch = await createGitBranch(projects[0].github_repo_url, title)
      } catch (gitError) {
        console.error("Git branch creation failed:", gitError)
        // Continue without branch creation
      }
    }

    // Create task
    const [result] = await req.db.execute(
      `INSERT INTO tasks (title, description, project_id, assignee_id, created_by, 
       priority, due_date, estimated_hours, git_branch) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [title, description, project_id, assignee_id, req.user.id, priority, due_date, estimated_hours, gitBranch],
    )

    const taskId = result.insertId

    // Send WhatsApp notification if assignee has phone number
    if (assignee_id) {
      const [assignees] = await req.db.execute("SELECT phone, first_name FROM users WHERE id = ?", [assignee_id])

      if (assignees.length > 0 && assignees[0].phone) {
        const message = `Hi ${assignees[0].first_name}, you have been assigned a new task: "${title}". Due date: ${due_date || "Not set"}`

        try {
          await sendWhatsAppMessage(assignees[0].phone, message)

          // Log WhatsApp message
          await req.db.execute(
            "INSERT INTO whatsapp_logs (recipient_phone, message, task_id, status) VALUES (?, ?, ?, ?)",
            [assignees[0].phone, message, taskId, "sent"],
          )
        } catch (whatsappError) {
          console.error("WhatsApp notification failed:", whatsappError)
        }
      }
    }

    // Log activity
    await req.db.execute(
      "INSERT INTO activity_logs (user_id, action, entity_type, entity_id, details) VALUES (?, ?, ?, ?, ?)",
      [req.user.id, "created", "task", taskId, JSON.stringify({ title, project_id })],
    )

    res.status(201).json({
      message: "Task created successfully",
      task: {
        id: taskId,
        title,
        git_branch: gitBranch,
        assignee_id,
      },
    })
  } catch (error) {
    console.error("Create task error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Update task status
router.patch("/:taskId/status", authenticateToken, async (req, res) => {
  try {
    const { taskId } = req.params
    const { status } = req.body

    const validStatuses = ["todo", "in_progress", "review", "done", "blocked"]
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status" })
    }

    // Check if user can update this task
    const [tasks] = await req.db.execute(
      `
      SELECT t.*, p.project_manager_id, pm.user_id as is_team_member
      FROM tasks t
      JOIN projects p ON t.project_id = p.id
      LEFT JOIN project_members pm ON p.id = pm.project_id AND pm.user_id = ?
      WHERE t.id = ?
    `,
      [req.user.id, taskId],
    )

    if (tasks.length === 0) {
      return res.status(404).json({ message: "Task not found" })
    }

    const task = tasks[0]
    const canUpdate =
      req.user.role === "admin" ||
      task.assignee_id === req.user.id ||
      task.project_manager_id === req.user.id ||
      task.is_team_member

    if (!canUpdate) {
      return res.status(403).json({ message: "Not authorized to update this task" })
    }

    // Update task status
    await req.db.execute("UPDATE tasks SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?", [status, taskId])

    // Log activity
    await req.db.execute(
      "INSERT INTO activity_logs (user_id, action, entity_type, entity_id, details) VALUES (?, ?, ?, ?, ?)",
      [req.user.id, "updated", "task", taskId, JSON.stringify({ status, previous_status: task.status })],
    )

    res.json({ message: "Task status updated successfully" })
  } catch (error) {
    console.error("Update task status error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Helper function to create Git branch
async function createGitBranch(repoUrl, taskTitle) {
  try {
    // Extract owner and repo from GitHub URL
    const match = repoUrl.match(/github\.com\/([^/]+)\/([^/]+)/)
    if (!match) throw new Error("Invalid GitHub URL")

    const [, owner, repo] = match
    const branchName = `feature/${taskTitle
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "")}`

    // Get default branch
    const repoResponse = await axios.get(`https://api.github.com/repos/${owner}/${repo}`, {
      headers: {
        Authorization: `token ${process.env.GITHUB_TOKEN}`,
        Accept: "application/vnd.github.v3+json",
      },
    })

    const defaultBranch = repoResponse.data.default_branch

    // Get the SHA of the default branch
    const branchResponse = await axios.get(
      `https://api.github.com/repos/${owner}/${repo}/git/refs/heads/${defaultBranch}`,
      {
        headers: {
          Authorization: `token ${process.env.GITHUB_TOKEN}`,
          Accept: "application/vnd.github.v3+json",
        },
      },
    )

    const sha = branchResponse.data.object.sha

    // Create new branch
    await axios.post(
      `https://api.github.com/repos/${owner}/${repo}/git/refs`,
      {
        ref: `refs/heads/${branchName}`,
        sha: sha,
      },
      {
        headers: {
          Authorization: `token ${process.env.GITHUB_TOKEN}`,
          Accept: "application/vnd.github.v3+json",
        },
      },
    )

    return branchName
  } catch (error) {
    console.error("Git branch creation error:", error)
    throw error
  }
}

module.exports = router
