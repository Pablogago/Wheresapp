import React, {useState} from 'react'
import UploadImage from "./UploadImage"
import AttachFileIcon from '@material-ui/icons/AttachFile';
import {IconButton } from "@material-ui/core";
import "./Modal.css"

function Modal({user, roomId}) {
  const [open,setOpen] = useState(false);

  const toggleTrueFalse = () => setOpen(!open);

  return (
    <div className="modal">
      <IconButton className="modal_close" onClick={toggleTrueFalse}><AttachFileIcon /></IconButton>
        {open ? <div className="modal__open"> <UploadImage open={() => toggleTrueFalse()} user={user} roomId={roomId}/></div>
        : null
        }
    </div>
  )
}

export default Modal
