import http, { request } from "http";
import { WebSocketServer } from "ws";
import url from "url";
import { v4 as uuidv4 } from "uuid";

const server = http.createServer();

const wsServer = new WebSocketServer({ server });
const port = 8000;

const connections = {};
const users = {};

const broadcast = () => {
  Object.keys(connections).forEach((uuid) => {
    const connection = connections[uuid];
    const message = JSON.stringify(users);
    connection.send(message);
  });
};

const handleMessage = (bytes, uuid) => {
  // message = {"x": 0, "y": 0}
  const message = JSON.parse(bytes.toString());
  const user = users[uuid];
  user.state = message;

  broadcast();
  console.log(`${user.username} state updated: ${JSON.stringify(user.state)}`);
};

const handleClose = (uuid) => {
  console.log(`${connections[uuid].username} disconnected`);

  delete connections[uuid];
  delete users[uuid];

  broadcast();
};

wsServer.on("connection", (connection, request) => {
  // ws://localhost:8000?username=name

  const { username } = url.parse(request.url, true).query;
  const uuid = uuidv4();
  console.log(username);
  console.log(uuid);

  connections[uuid] = connection;
  //   console.log(connections);

  users[uuid] = {
    username: username,
    state: {},
  };

  connection.on("message", (message) => handleMessage(message, uuid));
  connection.on("close", () => handleClose(uuid));
});

server.listen(port, () => {
  console.log("Websocket server running on port: ", port);
});
