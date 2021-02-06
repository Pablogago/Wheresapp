import React, { useState } from 'react'
import {Button} from "@material-ui/core"
import {storage} from "../firebase"
import db from "../firebase"
import firebase from "firebase"
import "./UploadImage.css"

function UploadImage({user, roomId,open}) {
  const [image,setImage] = useState(null);
  const [caption, setCaption] = useState("");

  const handleChange = (e) => {
    if (e.target.files [0]){
      setImage(e.target.files[0]);
    }
  }

  const handleUpload = () => {
    const uploadTask = storage.ref(`images/${image.name}`).put(image);

    uploadTask.on (
      "state_changed",
      (snapshot) => { 
        // progress function ...
        const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        console.log(progress)
      },
      (error) => {
        // Error function ...
        console.log(error);
        alert(error.message);
      },
      () => {
        // complete function
        storage
          .ref("images")
          .child(image.name)
          .getDownloadURL()
          .then(url => {
            //post image inside db
            db.collection("rooms").doc(roomId).collection("messages").add({
              timestamp: firebase.firestore.FieldValue.serverTimestamp(),
              caption: caption,
              imageUrl: url,
              name: user
            });
            setCaption("");
            setImage(null);
          });

      }
    );
    open();
  };

  return (
    <div className="uploadImage">
        <p>Upload Files</p>
          <input className="uploadImage__inputText" type="text" placeholder="Enter a caption..." onChange={event => setCaption(event.target.value)} value={caption} />
          <input className="uploadImage__inputFile"style={{marginBottom: 10}}type="file" onChange={handleChange} />
        <Button className="uploadImage__buttonUpload" onClick={handleUpload} >
          upload
        </Button>
    </div>
  )
}

export default UploadImage
