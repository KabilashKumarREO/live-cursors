import { useState } from "react";
import Home from "./Home";
import Login from "./components/Login";

const App = () => {
  const [username, setUsername] = useState("");

  return username ? (
    <Home username={username} />
  ) : (
    <Login onSubmit={setUsername} />
  );
};

export default App;
