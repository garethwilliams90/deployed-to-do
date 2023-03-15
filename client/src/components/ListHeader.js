import React, { useState } from "react"
import Modal from "./Modal"
import { useCookies } from "react-cookie"

function ListHeader(props) {
  const [cookies, setCookies, removeCookies] = useCookies(null)
  const [showModal, setShowModal] = useState(false)

  const signOut = () => {
    console.log("Sign Out.")
    removeCookies("Email")
    removeCookies("AuthToken")

    window.location.reload()
  }

  return (
    <div className="list-header">
      <h1>{props.listName}</h1>
      <div className="button-container">
        <button className="create" onClick={() => setShowModal(true)}>
          ADD NEW
        </button>
        <button className="signout" onClick={signOut}>
          SIGN OUT
        </button>
      </div>
    </div>
  )
}

export default ListHeader
