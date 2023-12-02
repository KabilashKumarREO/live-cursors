import { useState } from "react";

const Login = ({ onSubmit }) => {
  const [username, setUsername] = useState("");

  return (
    <>
      <h1>Your name</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit(username);
        }}
      >
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
        />
        <button>Submit</button>
      </form>
    </>
  );
};

export default Login;
