const express = require("express")
const { authenticateToken, authorizeRoles, canAccessProject } = require("../middleware/auth")

const router = express.Router()

// Get all projects (with role-based filtering)
router.get("/", authenticateToken, async (req, res) => {
  try {
    const { role, id: userId } = req.user
    const { status, page = 1, limit = 10 } = req.query

    let query = `
      SELECT p.*, 
             CONCAT(pm.first_name, ' ', pm.last_name) as project_manager_name,
             CONCAT(c.first_name, ' ', c.last_name) as client_name,
             COUNT(DISTINCT t.id) as total_tasks,
             COUNT(DISTINCT CASE WHEN t.status = 'done' THEN t.id END) as completed_tasks
      FROM projects p
      LEFT JOIN users pm ON p.project_manager_id = pm.id
      LEFT JOIN users c ON p.client_id = c.id
      LEFT JOIN tasks t ON p.id = t.project_id
    `

    const params = []
    const conditions = []

    // Role-based filtering
    if (role === "client") {
      conditions.push("p.client_id = ?")
      params.push(userId)
    } else if (role === "project_manager") {
      conditions.push("(p.project_manager_id = ? OR pm_members.user_id = ?)")
      params.push(userId, userId)
      query = query.replace(
        "FROM projects p",
        `
        FROM projects p
        LEFT JOIN project_members pm_members ON p.id = pm_members.project_id
      `,
      )
    } else if (role === "team_member") {
      conditions.push("team_members.user_id = ?")
      params.push(userId)
      query = query.replace(
        "FROM projects p",
        `
        FROM projects p
        LEFT JOIN project_members team_members ON p.id = team_members.project_id
      `,
      )
    }

    // Status filtering
    if (status) {
      conditions.push("p.status = ?")
      params.push(status)
    }

    if (conditions.length > 0) {
      query += " WHERE " + conditions.join(" AND ")
    }

    query += " GROUP BY p.id ORDER BY p.created_at DESC"

    // Pagination
    const offset = (page - 1) * limit
    query += " LIMIT ? OFFSET ?"
    params.push(Number.parseInt(limit), offset)

    const [projects] = await req.db.execute(query, params)

    // Calculate completion percentage
    const projectsWithProgress = projects.map((project) => ({
      ...project,
      completion_percentage:
        project.total_tasks > 0 ? Math.round((project.completed_tasks / project.total_tasks) * 100) : 0,
    }))

    res.json({ projects: projectsWithProgress })
  } catch (error) {
    console.error("Get projects error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Create new project
router.post("/", authenticateToken, authorizeRoles("admin", "project_manager"), async (req, res) => {
  try {
    const {
      name,
      description,
      start_date,
      deadline,
      client_id,
      project_manager_id,
      github_repo_url,
      budget,
      team_members = [],
    } = req.body

    if (!name) {
      return res.status(400).json({ message: "Project name is required" })
    }

    // Create project
    const [result] = await req.db.execute(
      `INSERT INTO projects (name, description, start_date, deadline, client_id, 
       project_manager_id, github_repo_url, budget) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, description, start_date, deadline, client_id, project_manager_id, github_repo_url, budget],
    )

    const projectId = result.insertId

    // Add team members
    if (team_members.length > 0) {
      const memberValues = team_members.map((memberId) => [projectId, memberId])
      await req.db.query("INSERT INTO project_members (project_id, user_id) VALUES ?", [memberValues])
    }

    // Log activity
    await req.db.execute(
      "INSERT INTO activity_logs (user_id, action, entity_type, entity_id, details) VALUES (?, ?, ?, ?, ?)",
      [req.user.id, "created", "project", projectId, JSON.stringify({ name })],
    )

    res.status(201).json({
      message: "Project created successfully",
      project: { id: projectId, name, description },
    })
  } catch (error) {
    console.error("Create project error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Get single project
router.get("/:projectId", authenticateToken, canAccessProject, async (req, res) => {
  try {
    const { projectId } = req.params

    const [projects] = await req.db.execute(
      `
      SELECT p.*, 
             CONCAT(pm.first_name, ' ', pm.last_name) as project_manager_name,
             CONCAT(c.first_name, ' ', c.last_name) as client_name,
             pm.email as project_manager_email,
             c.email as client_email
      FROM projects p
      LEFT JOIN users pm ON p.project_manager_id = pm.id
      LEFT JOIN users c ON p.client_id = c.id
      WHERE p.id = ?
    `,
      [projectId],
    )

    if (projects.length === 0) {
      return res.status(404).json({ message: "Project not found" })
    }

    // Get team members
    const [teamMembers] = await req.db.execute(
      `
      SELECT u.id, u.first_name, u.last_name, u.email, u.role, pm.role as project_role
      FROM project_members pm
      JOIN users u ON pm.user_id = u.id
      WHERE pm.project_id = ?
    `,
      [projectId],
    )

    // Get recent tasks
    const [recentTasks] = await req.db.execute(
      `
      SELECT t.*, CONCAT(u.first_name, ' ', u.last_name) as assignee_name
      FROM tasks t
      LEFT JOIN users u ON t.assignee_id = u.id
      WHERE t.project_id = ?
      ORDER BY t.updated_at DESC
      LIMIT 10
    `,
      [projectId],
    )

    const project = {
      ...projects[0],
      team_members: teamMembers,
      recent_tasks: recentTasks,
    }

    res.json({ project })
  } catch (error) {
    console.error("Get project error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

module.exports = router
