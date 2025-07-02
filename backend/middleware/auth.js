const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")

// JWT token verification middleware
const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers["authorization"]
  const token = authHeader && authHeader.split(" ")[1]

  if (!token) {
    return res.status(401).json({ message: "Access token required" })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    // Get user from database
    const [rows] = await req.db.execute(
      "SELECT id, email, role, first_name, last_name, is_active FROM users WHERE id = ?",
      [decoded.userId],
    )

    if (rows.length === 0 || !rows[0].is_active) {
      return res.status(401).json({ message: "Invalid or inactive user" })
    }

    req.user = rows[0]
    next()
  } catch (error) {
    return res.status(403).json({ message: "Invalid or expired token" })
  }
}

// Role-based authorization middleware
const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Authentication required" })
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: "Insufficient permissions for this action",
      })
    }

    next()
  }
}

// Check if user can access project
const canAccessProject = async (req, res, next) => {
  const projectId = req.params.projectId || req.body.project_id
  const userId = req.user.id
  const userRole = req.user.role

  // Admins can access all projects
  if (userRole === "admin") {
    return next()
  }

  try {
    // Check if user is project manager or team member
    const [rows] = await req.db.execute(
      `
      SELECT p.id FROM projects p
      LEFT JOIN project_members pm ON p.id = pm.project_id
      WHERE p.id = ? AND (
        p.project_manager_id = ? OR 
        pm.user_id = ? OR 
        (p.client_id = ? AND ? = 'client')
      )
    `,
      [projectId, userId, userId, userId, userRole],
    )

    if (rows.length === 0) {
      return res.status(403).json({
        message: "Access denied to this project",
      })
    }

    next()
  } catch (error) {
    console.error("Project access check error:", error)
    res.status(500).json({ message: "Server error" })
  }
}

// Utility functions
const hashPassword = async (password) => {
  return await bcrypt.hash(password, 12)
}

const comparePassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword)
}

const generateToken = (userId, email, role) => {
  return jwt.sign({ userId, email, role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || "24h" })
}

module.exports = {
  authenticateToken,
  authorizeRoles,
  canAccessProject,
  hashPassword,
  comparePassword,
  generateToken,
}
