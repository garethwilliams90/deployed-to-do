const PORT = process.env.PORT ?? 8000
const express = require("express")
const app = express()
const pool = require("./db")
const cors = require("cors")
const { v4: uuidv4 } = require("uuid")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

// app.get('/',  (req, res) => {
//     res.send("Hello!")
// })

app.use(cors())
app.use(express.json())

// Get all the todos
app.get("/todos/:userEmail", async (req, res) => {
  const { userEmail } = req.params

  try {
    const TODOS = await pool.query(
      "SELECT * FROM todos WHERE user_email = $1",
      [userEmail]
    )
    res.json(TODOS.rows)
  } catch (err) {
    console.error(err)
  }
})

// Create a new TODO item
app.post("/todos", async (req, res) => {
  const { user_email, title, progress, date } = req.body
  const id = uuid()

  try {
    const newToDo = await pool.query(
      `INSERT INTO todos(id, user_email, title, progress, date) VALUES($1, $2, $3, $4, $5)`,
      [id, user_email, title, progress, date]
    )
    res.json(newToDo)
  } catch (err) {
    console.error(err)
  }
})

// Edit a TODO item
app.put("/todos/:id", async (req, res) => {
  const { id } = req.params
  const { user_email, title, progress, date } = req.body

  try {
    const editTodo = await pool.query(
      "UPDATE todos SET user_email = $1, title = $2, progess = $3, date = $4 WHERE id = $5;",
      [user_email, title, progress, date, id]
    )
    res.json(editTodo)
  } catch (err) {
    console.error(err)
  }
})

// Signup
app.post("/signup", async (req, res) => {
  const { email, password } = req.body
  const salt = bcrypt.genSaltSync(10)
  const hashed_password = bcrypt.hashSync(password, salt)

  try {
    const signup = await pool.query(
      `INSERT INTO users (email, hashed_password) VALUES($1, $2)`,
      [email, hashed_password]
    )
    const token = jwt.sign({ email }, "secret", { expiresIn: "1hr" })

    res.json({ email, token })
  } catch (err) {
    console.error(err)
  }
})

// Login
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body
    const users = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ])
    if (!users.rows.length) return res.json({ detail: "user does not exist" })

    const success = await bcrypt.compare(
      password,
      users.rows[0].hashed_password
    )
    const token = jwt.sign({ email }, "secret", { expiresIn: "1hr" })

    if (success) {
      return res.json({ email: users.rows[0].email, token })
    } else {
      return res.json({ detail: "Login Failed" })
    }
  } catch (err) {
    console.error(err)

    if (err) res.json({ detail: err.detail })
  }
})

// Signout

app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`))
