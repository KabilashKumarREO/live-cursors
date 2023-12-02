import { useEffect, useRef } from "react";
import useWebSocket from "react-use-websocket";
import throttle from "lodash.throttle";
import Cursor from "./components/Cursor";

const renderCursors = (users) => {
  return Object.keys(users).map((uuid) => {
    const user = users[uuid];

    return <Cursor key={uuid} point={[user.state.x, user.state.y]} />;
  });
};

const renderUsersList = (users) => {
  return (
    <ul>
      {Object.keys(users).map((uuid) => {
        return <li key={uuid}>{JSON.stringify(users[uuid])}</li>;
      })}
    </ul>
  );
};

const Home = ({ username }) => {
  const WS_URL = "ws://127.0.0.1:8000";
  const { sendJsonMessage, lastJsonMessage } = useWebSocket(WS_URL, {
    queryParams: { username },
  });

  const THROTTLE = 1000; // 1sec
  const sendThrottledJsonMessage = useRef(throttle(sendJsonMessage, THROTTLE));

  useEffect(() => {
    // initializing every time to 0.
    sendJsonMessage({
      x: 0,
      y: 0,
    });
    // watching mouse move event.
    window.addEventListener("mousemove", (e) => {
      sendThrottledJsonMessage.current({
        x: e.clientX,
        y: e.clientY,
      });
    });
  }, []);

  if (lastJsonMessage) {
    return (
      <div>
        {renderCursors(lastJsonMessage)}
        {renderUsersList(lastJsonMessage)}
      </div>
    );
  }
  return <h1>Hello, {username}</h1>;
};

export default Home;
