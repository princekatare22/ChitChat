import "./App.css";
import ReactAudioPlayer from "react-audio-player";
import { StorageDB } from "./firebase";
import { v4 } from "uuid";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

import { useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";

function App() {
  const socket = useMemo(() => io("https://chitchatbackend-bptk.onrender.com"), []);
  
  const [Allmessage, setAllmessage] = useState([]);
  const [message, setMessage] = useState("");
  const [room, setRoom] = useState("");
  const [name, setName] = useState("");

  const [vedio, setVideo] = useState("");
  const [audio, setAudio] = useState("");

  const [joined, setJoined] = useState(false);

  useEffect(function () {
    socket.on("connect", function () {
      console.log(socket.id);
    });

    socket.on("welcome", function (msg) {
      console.log(msg);
    });

    socket.on(
      "receive-message",
      function ({ message, name, userId, audio, vedio }) {
        let isUser = false;
        if (userId == socket.id) isUser = true;
        const newMsg = {
          message,
          name,
          isUser,
          audio,
          vedio,
        };
        console.log(newMsg);
        setAllmessage((Allmessage) => [...Allmessage, newMsg]);
      }
    );

    return function () {
      socket.disconnect;
    };
  }, []);

  console.log(Allmessage);

  function handleSummit(event) {
    event.preventDefault();
    socket.emit("message", {
      audio,
      vedio,
      message,
      room,
      name,
      userId: socket.id,
    });
    console.log(vedio);
    setMessage("");
    setAudio("");
    setVideo("");
  }

  function handeleJoin(event) {
    event.preventDefault();
    socket.emit("joinRoom", room);
    setJoined(true);
  }

  function handleVedio(event) {
    event.preventDefault();
    const videoStorage = ref(StorageDB, `Vedio/${v4()}`);
    uploadBytes(videoStorage, event.target.files[0]).then(async function (
      data
    ) {
      console.log(data);
      getDownloadURL(data.ref).then((url) => {
        setVideo(url);
      });
      alert("Vedio Uploaded");
    });
  }

  function handleAudio(event) {
    event.preventDefault();
    const audioStorage = ref(StorageDB, `Audio/${v4()}`);
    uploadBytes(audioStorage, event.target.files[0]).then(async function (
      data
    ) {
      console.log(data);
      getDownloadURL(data.ref).then((url) => {
        setAudio(url);
      });
      alert("Audio Uploaded");
    });
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
        {joined == true ? (
          <div>
            {Allmessage.map(function (msg) {
              console.log(msg);
              return (
                <div>
                  {msg.isUser ? (
                    <User
                      name={msg.name}
                      message={msg.message}
                      audio={msg.audio}
                      vedio={msg.vedio}
                    />
                  ) : (
                    <NonUser
                      name={msg.name}
                      message={msg.message}
                      audio={msg.audio}
                      vedio={msg.vedio}
                    />
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="JoinRoom">Join a room and chat with your friends</div>
        )}
      </div>
      <form onSubmit={handleSummit}>
        <input
          type="file"
          className=" upperText  fileinput"
          placeholder="vedio"
          accept="video/*"
          onChange={handleVedio}
        />
        <input
          type="file"
          className=" upperText  fileinput audio"
          placeholder="audio"
          accept=".mp3,audio/*"
          onChange={handleAudio}
        />
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

function NonUser({ name, message, audio, vedio }) {
  if (message != "") {
    return (
      <div className="textBox non-user">
        {name ? name : "anonymous"} : {message}
      </div>
    );
  } else if (audio != "") {
    return (
      <div className="non-user textBox">
        <h4
          style={{
            background: "transparent",
            color: "#0d0d0d",
          }}
        >
          {name + " :"}
        </h4>
        <ReactAudioPlayer
          src={audio}
          controls
          style={{ background: "transparent" }}
        />
      </div>
    );
  } else if (vedio != "") {
    return (
      <div className="non-user textBox">
        <h4
          style={{
            background: "transparent",
            color: "#0d0d0d",
          }}
        >
          {name + " :"}
        </h4>
        <video width="300" height="200" controls>
          <source src={vedio} type="video/mp4" />
        </video>
      </div>
    );
  }
}

function User({ name, message, audio, vedio }) {
  if (message != "") {
    return (
      <div className="textBox user">
        {name ? name : "anonymous"} : {message}
      </div>
    );
  } else if (audio != "") {
    return (
      <div className="user textBox">
        <h4
          style={{
            background: "transparent",
            color: "#0d0d0d",
          }}
        >
          {name + " :"}
        </h4>
        <ReactAudioPlayer
          src={audio}
          controls
          style={{ background: "transparent" }}
        />
      </div>
    );
  } else {
    return (
      <div className="user textBox">
        <h4
          style={{
            background: "transparent",
            color: "#0d0d0d",
          }}
        >
          {name + " :"}
        </h4>
        <video width="300" height="200" controls className="user">
          <source src={vedio} type="video/mp4" />
        </video>
      </div>
    );
  }
}

export default App;
