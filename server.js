const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const path = require("path");

const port = 3001;
const app = express();

app.use(cors());
app.use(express.static("."));
const server =http.createServer(app);

const io = socketIo(server, {
    cors: {
      origin: "http://127.0.0.1:5501", 
      methods: ["GET", "POST"],
    },
  });

  const connectedUsers = new Map();

io.on("connection",socket =>{
    console.log("User Connected");

    // Send the list of connected users to the newly connected user
    socket.emit("connected users",Array.from(connectedUsers.values()));

    socket.on("Set Username", (username) => {
        console.log(` ${username} connected`);
        // Broadcast the username to all connected clients
        io.emit("system message", `${username} Join the chat`);
         // Store the username in the Map
         connectedUsers.set(socket.id, username);
      });
      
    socket.on("chat message",function(data){
        io.emit("chat message",data);
    });
    socket.on("disconnect", () => {
        const username = connectedUsers.get(socket.id);
        if (username) {
            console.log(`${username} Disconnected`);
            // Remove the user from the Map on disconnect
            connectedUsers.delete(socket.id);
            // Broadcast a user-disconnected message
            io.emit("user disconnected", username);
        }
    });

});

server.listen(port,()=>console.log(`Listening on port ${port}`));