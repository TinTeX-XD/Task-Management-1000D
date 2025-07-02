const express = require("express")
const { hashPassword, comparePassword, generateToken, authenticateToken } = require("../middleware/auth")

const router = express.Router()

// Register new user
router.post("/register", async (req, res) => {
  try {
    const { email, password, first_name, last_name, role = "team_member", phone } = req.body

    // Validate input
    if (!email || !password || !first_name || !last_name) {
      return res.status(400).json({
        message: "Email, password, first name, and last name are required",
      })
    }

    // Check if user already exists
    const [existingUsers] = await req.db.execute("SELECT id FROM users WHERE email = ?", [email])

    if (existingUsers.length > 0) {
      return res.status(409).json({ message: "User already exists with this email" })
    }

    // Hash password
    const hashedPassword = await hashPassword(password)

    // Create user
    const [result] = await req.db.execute(
      "INSERT INTO users (email, password, first_name, last_name, role, phone) VALUES (?, ?, ?, ?, ?, ?)",
      [email, hashedPassword, first_name, last_name, role, phone],
    )

    // Generate token
    const token = generateToken(result.insertId, email, role)

    res.status(201).json({
      message: "User created successfully",
      token,
      user: {
        id: result.insertId,
        email,
        first_name,
        last_name,
        role,
      },
    })
  } catch (error) {
    console.error("Registration error:", error)
    res.status(500).json({ message: "Server error during registration" })
  }
})

// Login user
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" })
    }

    // Get user from database
    const [users] = await req.db.execute(
      "SELECT id, email, password, first_name, last_name, role, is_active FROM users WHERE email = ?",
      [email],
    )

    if (users.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" })
    }

    const user = users[0]

    if (!user.is_active) {
      return res.status(401).json({ message: "Account is deactivated" })
    }

    // Verify password
    const isValidPassword = await comparePassword(password, user.password)
    if (!isValidPassword) {
      return res.status(401).json({ message: "Invalid credentials" })
    }

    // Generate token
    const token = generateToken(user.id, user.email, user.role)

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        role: user.role,
      },
    })
  } catch (error) {
    console.error("Login error:", error)
    res.status(500).json({ message: "Server error during login" })
  }
})

// Get current user profile
router.get("/profile", authenticateToken, async (req, res) => {
  try {
    const [users] = await req.db.execute(
      "SELECT id, email, first_name, last_name, role, phone, avatar_url, created_at FROM users WHERE id = ?",
      [req.user.id],
    )

    if (users.length === 0) {
      return res.status(404).json({ message: "User not found" })
    }

    res.json({ user: users[0] })
  } catch (error) {
    console.error("Profile fetch error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

module.exports = router
