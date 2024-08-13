import React, { useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";
import { Container, TextField, Typography, Button } from "@mui/material";
const App = () => {
  const [text, setText] = useState("");
  const socket = useMemo(() => io("http://localhost:3110"), []);
  const [msg, setMsg] = useState([]);
  const [room, setRoom] = useState("");
  const [roomName, setRoomName] = useState("");
  const [socketID, setSocketID] = useState();

  useEffect(() => {
    socket.on("connect", () => {
      console.log("user connected", socket.id);
      setSocketID(socket.id);
    });

    socket.on("notify", (msg) => {
      console.log(msg);
    });

    socket.on("receive_msg", (data) => {
      console.log(data);
      setMsg((msg) => [...msg, data.text]);
    });

    return () => {
      socket.disconnect();
    };
  }, [1]);

  const handleSubmit = (e) => {
    e.preventDefault();
    socket.emit("message", { text, room });
    setText("");
  };
  const handleRoomJoin = (e) => {
    e.preventDefault();
    socket.emit("join_room", roomName);
    setRoomName("");
  };

  return (
    <Container>
      <Typography variant="h6" component="div">
        Welcome to Sockets, your id is {socketID}
      </Typography>
      <form onSubmit={handleRoomJoin}>
        <TextField
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
          label="Room"
          variant="outlined"
        />
        <Button type="submit" variant="contained" color="primary">
          Join Room
        </Button>
      </form>

      <form onSubmit={handleSubmit}>
        <TextField
          value={text}
          onChange={(e) => setText(e.target.value)}
          label="Message"
          variant="outlined"
        />
        <TextField
          value={room}
          onChange={(e) => setRoom(e.target.value)}
          label="To"
          variant="outlined"
        />
        <Button type="submit" variant="contained" color="primary">
          Send
        </Button>
      </form>
      <ul>
        {msg.map((m) => {
          return <li key={m}>{m}</li>;
        })}
      </ul>
    </Container>
  );
};

export default App;
