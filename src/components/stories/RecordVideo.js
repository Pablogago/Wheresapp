import React,{useRef, useState} from 'react';
import "./RecordVideo.css"
import ReactMediaRecorder from "@getapper/react-media-recorder";
import { useStateValue } from "../../StateProvider";
import db from "../../firebase";
import firebase from "firebase";
import { Camera } from 'react-cam';
import { IconButton } from "@material-ui/core";
import { Link } from 'react-router-dom'

function RecordVideo() {
  const [{user}] = useStateValue();
  const [toggleCamera, setToggleCamera] = useState(false);
  const [showStream, setShowStream] = useState(false);
  const [start, setStart] = useState(true)
  const videoRef = useRef(null);
  const cam = useRef(null);
  let uploading = false;

  const toggleTrueFalse = () => setToggleCamera(!toggleCamera);
  const toggleStream = () => setShowStream(!showStream);

  const uploadBlob = (blob) => {
    var myDate = new Date() // your date object
    if (uploading) return;
    uploading = true;
    var storageRef = firebase.storage().ref();
    var metadata = {
      contentType: 'videos/mp4'
    };
    var uploadTask = storageRef.child('videos/' + guidGenerator()).put(blob, metadata);
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
        uploading = false;
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
        uploading = false;
        // Upload completed successfully, now we can get the download URL
        uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
          console.log('File available at', downloadURL);
          db.collection("videos").doc().set({
            uid: user.uid,
            name: user.displayName,
            timestamp: myDate.setHours(myDate.getHours() + 24),
            video: downloadURL,
          });     
        });
      });
  }
  const showCamera = (startRecording, stopRecording) => {
    toggleTrueFalse();
    if(toggleCamera){
        startRecording();
        setStart(false);
    } else {
      stopRecording();
      setStart(true);
    }
  }


  return (
    <div className="recordVideo">
    {showStream ? 
    <div className="recordVideo__showStream">
          <Camera
            front={false}
            ref={cam}
          />
          <ReactMediaRecorder
            video
            render={({ startRecording, stopRecording, mediaBlob, status }) => {
          if (status === 'stopped' && mediaBlob && !uploading) {
            uploadBlob(mediaBlob);
          }
          return (
            <div className="recordVideo__toggleStart">
              <p>{status}</p>
          <button className="recordVideo__buttonStart" onClick={() => showCamera(startRecording,stopRecording)}>{start ? <div><svg className="recordVideo__StartVideo" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 163.86 163.86"><defs/><path d="M34.86 3.61C20.08-4.86 8.1 2.08 8.1 19.11v125.63c0 17.04 11.97 23.98 26.75 15.51l109.81-62.97c14.78-8.48 14.78-22.22 0-30.7L34.86 3.62z"/></svg></div> : <div><svg className="recordVideo__stopVideo" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 47.61 47.61"><defs/><path d="M18 40.98a6.63 6.63 0 01-13.26 0V6.63a6.63 6.63 0 0113.26 0v34.35zM42.88 40.98a6.63 6.63 0 01-13.26 0V6.63a6.63 6.63 0 0113.26 0v34.35z"/></svg></div>}</button>
              <button className="recordVideo__buttonClose"onClick={toggleStream}><svg className="recordVideo__startVideo" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 22.88 22.88"><defs/><path  d="M.32 1.9a1.14 1.14 0 010-1.58 1.14 1.14 0 011.6 0l9.51 9.54L20.97.32a1.12 1.12 0 011.57 0c.45.45.45 1.16 0 1.59l-9.52 9.52 9.52 9.54a1.12 1.12 0 01-1.57 1.59l-9.54-9.54-9.52 9.54c-.44.43-1.14.43-1.59 0a1.14 1.14 0 010-1.59l9.53-9.54L.32 1.91z"/></svg></button>
            </div>
        )
      }}
    />
    </div>   
     :<div className="recordVideo__openCamera">
        <Link to="/"><button className="recordVideo__linkCamera"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 22.88 22.88"><defs/><path  d="M.32 1.9a1.14 1.14 0 010-1.58 1.14 1.14 0 011.6 0l9.51 9.54L20.97.32a1.12 1.12 0 011.57 0c.45.45.45 1.16 0 1.59l-9.52 9.52 9.52 9.54a1.12 1.12 0 01-1.57 1.59l-9.54-9.54-9.52 9.54c-.44.43-1.14.43-1.59 0a1.14 1.14 0 010-1.59l9.53-9.54L.32 1.91z"/></svg></button></Link>
        <button className="recordVideo__buttonOpen" onClick={toggleStream}><svg className="recordVideo__toggle" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 284.25 284.25"><defs/><path d="M278.52 59.24a10.99 10.99 0 00-11.21.4l-58.17 35.45V74.8c0-9.76-7.92-17.68-17.68-17.68H17.68A17.68 17.68 0 000 74.8v134.65c0 9.76 7.92 17.68 17.68 17.68h173.78c9.76 0 17.68-7.92 17.68-17.68v-20.3l58.17 35.46a10.98 10.98 0 0011.21.4 11 11 0 005.73-9.66V68.9a11 11 0 00-5.73-9.65zm-24.04 122.7l-45.34-27.65v-24.34l45.34-27.64v79.62z"/></svg></button>
     </div>}
    </div>
  )
}


function guidGenerator() {
  var S4 = function() {
     return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
  };
  return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
}

export default RecordVideo

