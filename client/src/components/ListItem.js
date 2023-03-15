import React, { useState } from "react"
import TickIcon from "./Tick"
import ProgressBar from "./Progress"
import Modal from "./Modal"

function ListItem(props) {
  const [showModal, setShowModal] = useState(false)

  return (
    <li className="list-item">
      <div className="info-container">
        <TickIcon />
        <p className="task-title">{props.task.title}</p>
        <ProgressBar />
      </div>

      <div className="button-container">
        <button className="edit" onClick={() => setShowModal(true)}>
          EDIT
        </button>
        <button className="delete">DELETE</button>
      </div>
      {showModal && (
        <Modal
          mode={"edit"}
          setShowModal={setShowModal}
          getData={props.getData}
          task={props.task}
        />
      )}
    </li>
  )
}

export default ListItem
