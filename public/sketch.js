let socket;
let data;
let points = [];
function setup() {
  createCanvas(window.innerWidth, window.innerHeight + 20);
  background(51);

  //check if in dev mode
  hostname =
    window.location.hostname == "localhost"
      ? "http://localhost:3000"
      : window.location.hostname;

  //socket client instance
  socket = io.connect(hostname);
  //setup a listener for broadcast
  let points = [];
  socket.on("broadcast", data => {
    points.push(createVector(data.x, data.y));

    stroke(255, 204, 0);
    strokeWeight(4);

    noFill();
    beginShape();
    for (let i = 0; i < points.length; i++) {
      let x = points[i].x;
      let y = points[i].y;
      if (data.newLine) {
        points = [];
      }
      vertex(x, y);
    }
    endShape();
  });

  socket.on("clients_counter", counter => {
    textSize(32);
    fill(255);
    text("Online: " + counter, 10, 30);
  });
}

function draw() {
  data = {
    x: mouseX,
    y: mouseY,
    newLine: false
  };

  if (mouseIsPressed) {
    points.push(createVector(mouseX, mouseY));
    stroke(255);
    strokeWeight(4);

    noFill();
    beginShape();
    for (let i = 0; i < points.length; i++) {
      let x = points[i].x;
      let y = points[i].y;
      vertex(x, y);
    }
    endShape();

    //send the cordenator data
    socket.emit("cords", data);
  }
}

function mouseReleased() {
  data.newLine = true;
  socket.emit("cords", data);
  points = [];
}
