import React, { useEffect, useState } from 'react'
import './Sidebar.css'
import SidebarChat from "./SidebarChat"
import { Avatar, IconButton } from "@material-ui/core"
import DonutLargeIcon from '@material-ui/icons/DonutLarge';
import ChatIcon from '@material-ui/icons/Chat';
import PowerSettingsNewIcon from '@material-ui/icons/PowerSettingsNew';
import { SearchOutlined } from '@material-ui/icons';
import db from "../firebase";
import { useStateValue } from "../StateProvider";
import { Link } from 'react-router-dom';

function Sidebar(props) {
  const [{user}] = useStateValue();
  const [rooms, setRooms] = useState([]);
  const [filteredRooms, setFilteredRooms] = useState(null);
  const [roomQuery, setRoomQuery] = useState('');
/*   const [clicked, setClicked] = useState(false);
    const inputStyle = {
      transform: "translateX(-100%)"
    }; */

  useEffect(() => {
    const unsubscribe = db.collection("rooms").onSnapshot((snapshot) => {
      const newRooms = snapshot.docs.map(doc => ({
        id: doc.id,
        data: doc.data(),
      }))
      setRooms(newRooms);
      if (filteredRooms) {
        setFilteredRooms(prevState => {
          console.log([...prevState, ...newRooms]);
          return [...prevState, ...newRooms]
        });
      }
    });
    return () => {
      unsubscribe();
    }
  }, []);
 /*  const handleCLick = () => {
    setClicked(true)
  } */

  const onChangeRoomInput = (evt) => {
    const value = evt.currentTarget.value;
    setRoomQuery(value);
    setFilteredRooms(() => {
      if (!rooms) return;
      return rooms.filter(room => room.data && (room.data.name).toLowerCase().includes(value.toLowerCase()));
    });
  }
  const showedRooms = roomQuery.length ? filteredRooms : rooms;
  return (
    <div  /* style={clicked ? inputStyle : null} */ className="sidebar">
      <div className="sidebar__header">
        <Avatar src={user?.photoURL} />
        <div className="sidebar__headerRight">
        <Link to="/stories">
          <IconButton>
            <DonutLargeIcon/>
          </IconButton>
          </Link>
          <SidebarChat addNewChat />
          <IconButton onClick={props.signOut}>
            <PowerSettingsNewIcon />
          </IconButton>
        </div>
      </div>

      <div className="sidebar__search">
        <div className="sidebar__searchContainer">
          <SearchOutlined />
          <input
            value={roomQuery}
            placeholder="Search or start new chat"
            onChange={onChangeRoomInput}
            type="text" />
        </div>
      </div>
      <div className="sidebar__chats">
        {showedRooms.sort((a, b) => a.data.timestamp - b.data.timestamp).map(room => (
         /*  { <div onClick={handleCLick}> } */
          <SidebarChat
            key={room.id}
            id={room.id}
            name={room.data.name}/>
          /* </div> */
        ))}
      </div>
    </div>
  )
}

export default Sidebar
