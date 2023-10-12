const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const path = require("path");

const port = 3000;
const app = express();

app.use(express.static("."));
const server =http.createServer(app);
const io = socketIo(server, {
    cors: {
    //   origin: "http://127.0.0.1:5501", 
    origin: "https://neeraj1264.github.io/chatapp/", 
    methods: ["GET", "POST"],
    },
  });

  const connectedUsers = [];

io.on("connection",socket =>{
    console.log("User Connected");

    // Send the list of connected users to the newly connected user
    socket.emit("connected users", connectedUsers);

    socket.on("Set Username", (username) => {
        console.log(` ${username} connected`);
        // Broadcast the username to all connected clients
        io.emit("user set username", username);
      });
      
    socket.on("chat message",function(data){
        io.emit("chat message",data);
    });
    socket.on("disconnect",()=>{
        console.log("User Disconnected");
    });

});

server.listen(port,()=>console.log(`Listening on port ${port}`));
