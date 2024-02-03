require("dotenv").config();
const { Server } = require("socket.io");
const { createServer } = require("http");
const cors = require("cors");
const express = require("express");

const PORT = 5000;

const app = express();
const server = createServer(app);
const io = new Server(server, {
    origin: [
             "http://localhost:5173", 
             "https://chit-chat-frontend-red.vercel.app",
             "https://chit-chat-frontend-git-main-prince-katares-projects.vercel.app",
             "https://chit-chat-frontend-87r8h2obb-prince-katares-projects.vercel.app",
             "*"
            ],
    methods: ["GET", "PUT", "POST", "DELETE"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "x-csrf-token",
      "Access-Control-Allow-Origin",
    ],
    credentials: true,
    maxAge: 5000,
    exposedHeaders: ["*", "Authorization", "https://chit-chat-frontend-red.vercel.app"],
  });

app.use(
  cors({
    origin: [
             "http://localhost:5173", 
             "https://chit-chat-frontend-red.vercel.app",
             "https://chit-chat-frontend-git-main-prince-katares-projects.vercel.app",
             "https://chit-chat-frontend-87r8h2obb-prince-katares-projects.vercel.app",
             "*"
            ],
    methods: ["GET", "PUT", "POST", "DELETE"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "x-csrf-token",
      "Access-Control-Allow-Origin",
    ],
    credentials: true,
    maxAge: 5000,
    exposedHeaders: ["*", "Authorization", "https://chit-chat-frontend-red.vercel.app"],
  })
);

io.on("connection", function (socket) {
  console.log("User Connected " + socket.id);

  socket.on(
    "message",
    function ({ room, message, name, userId, audio, vedio }) {
      console.log("message received");
      console.log({ room, message, name, userId, audio, vedio });

      io.to(room).emit("receive-message", {
        userId,
        name,
        message,
        audio,
        vedio,
      });
    }
  );

  socket.on("disconnect", function () {
    console.log("User diconnected " + socket.id);
  });

  socket.on("joinRoom", function (room) {
    socket.join(room);
    console.log(`${socket.id} joined ${room}`);
  });
});

app.get("/", function (req, res) {});

server.listen(PORT, function () {
  console.log(`Server Running on PORT ${PORT}`);
});

app.listen(8000);
