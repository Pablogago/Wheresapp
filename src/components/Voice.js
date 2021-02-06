import React, { useState, useEffect } from 'react'
import Recorder from 'react-mp3-recorder'
import firebase from "firebase";
import db from "../firebase";
import "./Voice.css";




function Voice({ roomId, user, titleRef }) {
  const [tooltip, setTooltip] = useState(false);
  const [seed, setSeed] = useState(1);

  useEffect(() => {
    if (!tooltip) return;
    const timer = setTimeout(() => {
      setTooltip(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, [tooltip]);

  const onRecordingComplete = (blob) => {
    setSeed(seed + 1)
    console.log('recording', blob)
    if (blob.size <= 8000) {
      setTooltip(true);
      return;
    }
    var storageRef = firebase.storage().ref();
    var metadata = {
      contentType: 'audio/mpeg'
    };
    var uploadTask = storageRef.child('audio/' + blob + seed).put(blob, metadata);
    uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
      function (snapshot) {
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
        switch (snapshot.state) {
          case firebase.storage.TaskState.PAUSED: // or 'paused'
            console.log('Upload is paused');
            break;
          case firebase.storage.TaskState.RUNNING: // or 'running'
            console.log('Upload is running');
            break;
        }
      }, function (error) {

        // A full list of error codes is available at
        // https://firebase.google.com/docs/storage/web/handle-errors
        switch (error.code) {
          case 'storage/unauthorized':
            // User doesn't have permission to access the object
            break;

          case 'storage/canceled':
            // User canceled the upload
            break;

          case 'storage/unknown':
            // Unknown error occurred, inspect error.serverResponse
            break;
        }


      }, function () {
        // Upload completed successfully, now we can get the download URL
        uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
          console.log('File available at', downloadURL);
          db.collection("rooms").doc(roomId).collection("messages").add({
            audio: downloadURL,
            name: user.displayName,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            uid: user.uid,
          })
          titleRef.current.scrollTo(0, titleRef.current.scrollHeight);
        }); 
        
      });

  }
  const onRecordingError = (err) => {
    console.log('recording error', err)
    setTooltip(true);
  }

  return (
    <>
    {tooltip && (
      <p className="tooltip">Keep holding the button to send a message</p>
    )}
    <div className="voice">
      <Recorder
        onRecordingComplete={onRecordingComplete}
        onRecordingError={onRecordingError} />
    </div>
    </>
  )
}

export default Voice





