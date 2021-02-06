import React, { useState, useEffect, useRef } from 'react';
import "./Chat.css";
import { Avatar, IconButton } from "@material-ui/core";
import { SearchOutlined } from '@material-ui/icons';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import InsertEmoticonIcon from '@material-ui/icons/InsertEmoticon';
import { useParams, Redirect } from "react-router-dom";
import db from "../firebase";
import { useStateValue } from "../StateProvider";
import firebase from "firebase";
import 'emoji-mart/css/emoji-mart.css';
import { Picker } from 'emoji-mart'
import ClearIcon from '@material-ui/icons/Clear';
import Voice from './Voice'
import UploadImage from "./UploadImage"
import Modal from "./Modal"

function Chat() {
  const [seed, setSeed] = useState('');
  const [input, setInput] = useState('');
  const { roomId } = useParams();
  const [roomName, setRoomName] = useState("");
  const [messages, setMessages] = useState([])
  const [{user}] = useStateValue();
  const [showEmoji, setShowEmoji] = useState(false);
  const [redirectToSidebar, setRedirectToSidebar] = useState(false)
  
  const titleRef = useRef();
  const chatNode = useRef();
  const toggleTrueFalse = () => setShowEmoji(!showEmoji);

  useEffect(() => {
    if (roomId) {
      db.collection('rooms')
        .doc(roomId)
        .onSnapshot(snapshot => setRoomName
          (snapshot.data().name));

      db.collection('rooms')
      .doc(roomId)
      .collection("messages")
      .orderBy("timestamp", "asc")
      .onSnapshot(snapshot => (
        setMessages(snapshot.docs.map(doc => {
          return Object.assign(doc.data(), { ref: doc.ref });
        }))
      ))
    }
  }, [roomId])

  useEffect(() => {
    setSeed(Math.floor(Math.random() * 5000))
  }, [roomId])

  const sendMessage = (e) => {
    e.preventDefault();
    if (!input.length) return;
    db.collection("rooms").doc(roomId).collection("messages").add({
      message: input,
      name: user.displayName,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      uid: user.uid,
    })   
    setInput("");
    setShowEmoji(false);
  };
  
  useEffect(_ => {
    if (!titleRef || !titleRef.current) return;
    titleRef.current.scrollTo(0, titleRef.current.scrollHeight);
  }, [messages.length]);

  const onDeleteMessage = (ref) => {
    ref.update({
      message: null,
      audio: null,
      imageUrl: null,
    });
  }
  const displayEmoji = e => {
    let emoji = e.native;
    setInput(input + emoji)
  }

  const onClickBack = () => {
    const animation = chatNode.current.animate(
      [
        { opacity: 1 },
        { opacity: 0 },
      ], 175);
    animation.onfinish = _ => {
      setRedirectToSidebar(true);
    }
  }

  if (redirectToSidebar) {
    return <Redirect to="/"/>;
  }

  return (
    <div ref={chatNode} className="chat slideIn">
      <div className="chat__header">
        {/* <Link to="/">
        <button>back</button>
        </Link> */}
        <button className="chat__headerButton" onClick={onClickBack}><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 492 492"><defs/><path d="M464.34 207.42l.77.17H135.9l103.5-103.73a26.93 26.93 0 007.84-19.12c0-7.2-2.78-14.01-7.85-19.09l-16.1-16.11a26.7 26.7 0 00-19-7.87 26.7 26.7 0 00-19.02 7.85L7.84 226.92A26.66 26.66 0 000 245.96a26.66 26.66 0 007.84 19.1l177.42 177.41a26.7 26.7 0 0019.01 7.85c7.2 0 13.95-2.8 19.01-7.85l16.1-16.11a26.65 26.65 0 007.85-19c0-7.2-2.78-13.6-7.85-18.66l-104.66-104.3h330c14.82 0 27.28-12.78 27.28-27.6V234c0-14.81-12.83-26.6-27.66-26.6z"/></svg></button>
        <Avatar src={`https://avatars.dicebear.com/api/avataaars/${seed}.svg`} />
        <div className="chat__headerInfo">
          <h3>{roomName}</h3>
          <p>{!messages.length < 1 ? new Date(messages[messages.length - 1]?.
            timestamp?.toDate()).toUTCString().slice(5, 12)  : <div>Any messages yet...</div>}
          </p>
        </div>
        <div className="chat__headerRight">
              <Modal user={user.displayName} roomId={roomId} />

        </div>
      </div>
        
      <div className="chat__body" ref={titleRef}>
        {messages.map((message, index) => (
        <div key={index}> 
          <p  className={`chat__message ${message.name === user?.displayName && 'chat__receiver'}`}>
            <span className="chat__name">{message.name}</span>
            {!message.message && !message.audio && !message.imageUrl
            ? <p className="chat__eliminatedMessage"><span><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 17 19" width="17" height="19"><path fill="currentColor" d="M12.629 12.463a5.17 5.17 0 0 0-7.208-7.209l7.208 7.209zm-1.23 1.229L4.191 6.484a5.17 5.17 0 0 0 7.208 7.208zM8.41 2.564a6.91 6.91 0 1 1 0 13.82 6.91 6.91 0 0 1 0-13.82z"></path></svg></span>El mensaje ha sido eliminado</p>
            : !message.message && message.audio && !message.imageUrl
            ? <audio controls="controls" src={message.audio} type="audio/mpeg"/>
            : !message.message && !message.audio && message.imageUrl
            ? <img className="chat__image wrap" src={message.imageUrl} alt={message.caption} /> 
            : message.message 
          }
          

            <span className="chat__timestamp marginTop">{new Date(message.timestamp?.toDate()).toUTCString().slice(5, 12)}</span>
            
            {!message.message && !message.audio && !message.imageUrl
            ? null : 
                <ClearIcon className="marginTop" onClick={_ => onDeleteMessage(message.ref)}/>}
          </p>
        </div>
        ))}
      </div>

      <div className="chat__footer">
        {showEmoji && <IconButton onClick={_ =>setShowEmoji(false)}><ClearIcon/></IconButton>}
        <IconButton onClick={toggleTrueFalse}>
          <InsertEmoticonIcon />
        </IconButton>
        {showEmoji && <Picker onClick={displayEmoji}/>}
        <form>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            type="text"
            placeholder="type a message" />
            <button onClick={sendMessage} type="submit">Send a message</button>
        </form>

          <Voice 
          titleRef={titleRef}
          roomId={roomId}
          user={user}/> 
          
      </div>
    </div>
  )
}

export default Chat
