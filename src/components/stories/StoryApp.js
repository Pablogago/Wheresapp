import React,{useState, useEffect} from 'react'
import "./StoryApp.css"
import Video from "./Video"
import RecordVideo from "./RecordVideo"
import db from "../../firebase"
import { useParams } from "react-router-dom";

function StoryApp() {
  const { roomId } = useParams();
  return (
    <div className="story">
      <div className="story__header">
        <RecordVideo/>
      </div>
      <div className="story__body">
      <VideoList />
      </div>

    </div>
  )
}

function VideoList() {
  const [videos, setVideos] = useState([]);
  let before24Hour = Date.now() - (24 * 3600 * 1000);

  const getVideos = async () => {
    db.collection('videos').where('timestamp', '>=', before24Hour).orderBy("timestamp", "desc").onSnapshot(querySnap => {
      const totalDocs = querySnap.docs;
      totalDocs.forEach(doc => {
        const docData = doc.data();
        Object.assign(docData, {id: doc.id});
        setVideos((prevState) => {
          if (prevState.find(oldDoc => oldDoc.id === doc.id)) {
            return prevState;
          }
          return [...prevState, docData];
        });
      })
    });
  }

  useEffect(_ => {
    getVideos();
  }, []);

  useEffect(_ => {

  }, [videos]);

  if (!videos.length) {
    return <div className="story__videos"></div>
  }

  return (
    <div className="story__videos"> 
      {videos.map(({video,name,timestamp}) => (<Video timestamp={timestamp} name={name} video={video}/>)
      )}
    </div>
  )
}

export default StoryApp


