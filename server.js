const express = require("express");
const socket = require("socket.io");
//currently stored drawing to be served for the new client
let store = [];
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
  io.sockets.emit("clients_counter", clients);

  //send the stored drawing to the new client only
  socket.emit("stored_drawing", store);

  //take the data from the broadcaster
  socket.on("cords", data => {
    console.log(data);
    store.push(data);
    //broadcast data to all listeners
    socket.broadcast.emit("broadcast", data);
  });

  socket.on("disconnect", disconnected);
  socket.on("clear", () => {
    //clear stored drawing
    store = [];
    //send clear canvas event
    io.sockets.emit("clear-client");
  });
}

function disconnected(socket) {
  clients--;
  console.log("user disconnected");
}
