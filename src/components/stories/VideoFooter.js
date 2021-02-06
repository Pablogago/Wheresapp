import React,{ useState , useEffect} from 'react'
import "./VideoFooter.css"

function VideoFooter({name, timestamp}) {
  const [counter, setCounter] = useState(0);
  const [timeNow, setTimeNow] = useState();

  useEffect(() => {
    const now = new Date();
    var getTheDate = (now + "").slice(16,18);
    var timestampDate = (new Date(timestamp) + "").slice(16,18)
    setTimeNow(getTheDate-timestampDate)
  }, [])
  var now = new Date();
  React.useEffect(() => {
    counter > 0 && setTimeout(() => setCounter(counter + 1), 3600000);
  }, [counter]);
  return (
    <div className="videoFooter">
      <div className="videoFooter__text">
        <h4 className="videoFooter__name">{name}</h4>
        <div className="videoFooter__timeNow">{timeNow}h Ago </div>
      </div>
    </div>
  )
}

export default VideoFooter
