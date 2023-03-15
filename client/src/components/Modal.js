import React, { useState } from "react"
import { useCookies } from "react-cookie"

function Modal({ mode, setShowModal, getData, task }) {
  const [cookies, setCookies, removeCookies] = useCookies(null)
  const editMode = mode === "edit" ? true : false
  const [data, setData] = useState({
    user_email: editMode ? task.user_email : cookies.Email,
    title: editMode ? task.title : null,
    progress: editMode ? task.progress : null,
    date: editMode ? task.date : new Date(),
  })

  const postData = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch(`${process.env.REACT_URL}/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      setData(await response.json())
    } catch (err) {
      console.error(err)
    }
  }

  const editData = async (e) => {
    e.preventDefault()
    try {
      const repsonse = await fetch(`${process.env.REACT_URL}/${task.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (repsonse.status === 200) {
        setShowModal(false)
        getData()
      }
    } catch (err) {
      console.error(err)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target

    setData((data) => ({
      ...data,
      [name]: value,
    }))
  }

  return (
    <div className="overlay">
      <div className="modal">
        <div className="form-title-container">
          <h3>{`Lets ${mode} Your Task`}</h3>
          <button>X</button>
        </div>
        <form>
          <input
            required
            maxLength={30}
            placeholder=" Task goes here"
            name="title"
            value={""}
            onChange={handleChange()}
          />
          <br></br>
          <input
            required
            type="range"
            min="0"
            max="100"
            name="progress"
            value={""}
            onChange={handleChange()}
          />
          <br />
          <input
            className={mode}
            type="submit"
            onClick={editMode ? editData : postData}
          />
        </form>
      </div>
    </div>
  )
}

export default Modal
