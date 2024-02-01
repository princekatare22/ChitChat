import "./App.css";

import { useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";

function App() {
  const socket = useMemo(() => io("http://localhost:3000"), []);
  const [Allmessage, setAllmessage] = useState([]);
  const [message, setMessage] = useState("");
  const [room, setRoom] = useState("");
  const [name, setName] = useState("");

  const id = socket.id;
  useEffect(function () {
    socket.on("connect", function () {
      const id = socket.id;
      console.log(id);
    });

    socket.on("welcome", function (msg) {
      console.log(msg);
    });

    socket.on("receive-message", function ({ message, name, userId }) {
      let isUser = false;
      if (userId == socket.id) isUser = true;
      const newMsg = {
        message,
        name,
        isUser,
      };
      setAllmessage((Allmessage) => [...Allmessage, newMsg]);
    });

    return function () {
      socket.disconnect;
    };
  }, []);

  console.log(Allmessage);

  function handleSummit(event) {
    event.preventDefault();
    socket.emit("message", { message, room, name, userId: id });
    setMessage("");
  }

  function handeleJoin(event) {
    event.preventDefault();
    socket.emit("joinRoom", room);
  }

  return (
    <div>
      <input
        className="upperText"
        type="text"
        placeholder="Name"
        value={name}
        onChange={function (event) {
          setName(event.target.value);
        }}
      />
      <form onSubmit={handeleJoin}>
        <input
          className="upperText"
          type="text"
          placeholder="Room ID"
          value={room}
          onChange={function (event) {
            setRoom(event.target.value);
          }}
        />
        <br></br>
        <button className="upperText joinButton" type="summit">
          Join
        </button>
      </form>
      <div className="chatBox">
        {Allmessage.map(function (msg) {
          return (
            <div>
              {msg.isUser ? (
                <User name={msg.name} message={msg.message} />
              ) : (
                <NonUser name={msg.name} message={msg.message} />
              )}
            </div>
          );
        })}
      </div>
      <form onSubmit={handleSummit}>
        <input
          className="upperText lowerText"
          type="text"
          placeholder="type message..."
          value={message}
          onChange={function (event) {
            setMessage(event.target.value);
          }}
        />
        <button className="SendButton" type="summit">
          Send
        </button>
      </form>
    </div>
  );
}

function User({ name, message }) {
  return (
    <dir className="textBox user">
      {name ? name : "anonymous"} : {message}
    </dir>
  );
}

function NonUser({ message, name }) {
  return (
    <dir className="textBox non-user">
      {name ? name : "anonymous"} : {message}
    </dir>
  );
}

export default App;
