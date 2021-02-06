import React, {useRef, useState} from 'react'
import VideoFooter from "./VideoFooter"
import "./Video.css"

function Video({video, name, timestamp}) {
  const [playing, setPlaying] = useState(false);
  const videoRef = useRef(null);

  
  const onVideoPress = () => {
    if(playing){
      videoRef.current.pause();
      setPlaying(false);
    } else {
      videoRef.current.play();
      setPlaying(true);
    }
  };
    
  return (
    <div className="video">
      <video 
        className="video__player"
        loop
        onClick={onVideoPress}
        ref={videoRef}
        src={video}
        type="video/mp4"
      />

      <VideoFooter timestamp={timestamp} name={name} />
      {/* <VideoFooter/> */}
      {/* <VideoSidebar /> */}
    </div>
  )
}

export default Video
