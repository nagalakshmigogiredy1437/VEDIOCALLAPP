const express = require("express");
const http = require("http");
const Server = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = Server(server);

app.use(express.static("public"));

io.on("connection", (socket) => {
  console.log("User connected: ", socket.id);

  socket.on("join-room", (roomID) => {
    socket.join(roomID);
    console.log(`User ${socket.id} joined room ${roomID}`);
  });

  socket.on("call", ({ roomID, offer }) => {
    socket.to(roomID).emit("call", offer);
  });

  socket.on("answer", ({ roomID, answer }) => {
    socket.to(roomID).emit("answer", answer);
  });

  socket.on("candidate", ({ roomID, candidate }) => {
    socket.to(roomID).emit("candidate", candidate);
  });

  socket.on("end-call", (roomID, endcall) => {
    // Notify all users in the room to end the call
    socket.to(roomID).emit("end-call", endcall);
    // io.to(roomID).emit("end-call");
    console.log(`Call ended in room ${roomID}`);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected: ", socket.id);
  });
});

server.listen(3000, () => {
  console.log("Server is running on port 3000");
});
