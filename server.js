const express = require("express");
const socket = require("socket.io");

//express instance
const app = express();
//host public folder
app.use(express.static("public"));

// Use the port that Heroku provides or default to 3000
var port = process.env.PORT || 3000;
let clients = 0;
//server listen on port
const server = app.listen(port, function() {
  console.log("Express server is working");
});

//socket server instance
const io = socket(server);
//when a new socket connection happen
io.sockets.on("connection", newConnection);

function newConnection(socket) {
  console.log("socket id:" + socket.id);
  clients++;
  socket.emit("clients_counter", clients);

  //take the data from the broadcaster
  socket.on("cords", data => {
    console.log(data);
    //broadcast data to all listeners
    socket.broadcast.emit("broadcast", data);
  });

  socket.on("disconnect", disconnected);
}

function disconnected(socket) {
  clients--;
  console.log("user disconnected");
}
