import React from "react";
import { SessionLog } from "types";
import { fetchSessionLog } from "api";


const SessionPage: React.FC = () => {
  const [sessionLog, setSessionLog] = React.useState<SessionLog[]>([]);

    React.useEffect(() => {
      fetchSessionLog()
        .then((sessionLog) => {
          console.log(`fetchSessionLog got`, sessionLog);
          if (Array.isArray(sessionLog)) {
            setSessionLog(sessionLog);
          }
        })
        .catch((err) => console.error(err));
    }, []);

    return (
        <body>
            <div id="session-display-name">session 1</div>
            <div id="username" key={`sessionLog-${0}`}> {sessionLog.username} </div>
        </body>
    );
  };
  
  export default SessionPage;