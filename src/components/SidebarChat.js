import React, { useEffect, useState } from 'react';
import './SidebarChat.css';
import { Avatar } from "@material-ui/core";
import db from "../firebase";
import { Link } from "react-router-dom"
import { IconButton } from "@material-ui/core"
import ChatIcon from '@material-ui/icons/Chat';

function SidebarChat({id,name,addNewChat}) {
  const [seed, setSeed] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (id) {
      db.collection("rooms")
        .doc(id)
        .collection("messages")
        .orderBy("timestamp", "desc")
        .onSnapshot((snapshot) =>
          setMessages(snapshot.docs.map((doc) => doc.data()))
        );
    }
  }, []);

  useEffect(() => {
    setSeed(Math.floor(Math.random() * 5000))
  }, [])

  const createChat = () => {
    const roomName = prompt("please enter name for chat room");
    if(roomName){
      db.collection("rooms").add({
        name: roomName,
        timestamp: Date.now()
      });
    }
  };

  return !addNewChat ? (
    <Link style={{ color: 'inherit', textDecoration: 'inherit'}} to={`/rooms/${id}`}>
      <div className="sidebarChat">
        <Avatar src={`https://avatars.dicebear.com/api/avataaars/${seed}.svg`} />
        <div className="sidebarChat__info">
          <h2>{name}</h2>
          <p>{messages[0]?.message ? messages[0]?.message : messages[0]?.audio ? <p>audio</p> : messages[0]?.imageUrl ? <p>Image</p> :null}</p>

        </div>
      </div>
    </Link>
  ) : (
    <div className="Add__chat " onClick={createChat}>
        <IconButton >
          <ChatIcon />
        </IconButton>
    </div>
  )
};

export default SidebarChat