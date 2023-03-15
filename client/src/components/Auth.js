import React, { useState } from "react"
import { useCookies } from "react-cookie"

function Auth() {
  const [cookies, setCookies, removeCookies] = useCookies(null)
  const [loggedIn, setLoggedIn] = useState(false)
  const [error, setError] = useState(null)
  const [email, setEmail] = useState(null)
  const [password, setPassword] = useState(null)
  const [confirmPassword, setConfirmPassword] = useState(null)

  console.log(cookies)

  const viewLogin = (status) => {
    setError(null)
    setLoggedIn(status)
  }

  const handleSubmit = async (e, endpoint) => {
    e.preventDefault()

    if (!loggedIn && password !== confirmPassword) {
      setError("Your passwords do not match")
      return
    }

    const response = await fetch(`${process.env.REACT_URL}/${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })

    const data = await response.json()
    console.log(data)

    if (data.detail) {
      setError(data.detail)
    } else {
      setCookies("Email", data.email)
      setCookies("AuthToken", data.token)

      window.location.reload()
    }

    return (
      <div className="auth-container">
        <div className="auth-container-box">
          <form>
            <h2>{loggedIn ? "Please Log In" : "Please sign up"}</h2>
            <input
              type="email"
              placeholder="example@gmail.com"
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="password"
              onChange={(e) => setPassword(e.target.value)}
            />
            {!loggedIn && (
              <input
                type="password"
                placeholder="confirm your password"
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            )}
            <input
              type="submit"
              className="create"
              onClick={(e) => handleSubmit(e, loggedIn ? "login" : "signup")}
            />
            {error && <p>{error}</p>}
          </form>

          <div className="auth-options">
            <button
              onClick={() => viewLogin(false)}
              style={{
                backgroundColor: !loggedIn
                  ? "rgb(255,255,255)"
                  : "rgb(100,100,100)",
              }}
            >
              SIGN UP
            </button>
            <button
              onClick={() => viewLogin(true)}
              style={{
                backgroundColor: loggedIn
                  ? "rgb(255,255,255)"
                  : "rgb(100,100,100)",
              }}
            >
              LOGIN
            </button>
          </div>
        </div>
      </div>
    )
  }
}

export default Auth
