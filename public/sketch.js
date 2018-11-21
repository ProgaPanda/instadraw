let socket;
let data;
let points = [];
let font;
let current_color;
let color_picking = false;
function preload() {
  font = loadFont("css/fonts/DancingScript-Bold.ttf");
}

function setup() {
  document.body.addEventListener("touchmove", function(e) {
    e.preventDefault();
  });
  let canvas = createCanvas(window.innerWidth, window.innerHeight);
  canvas.parent("canvas");
  window.scrollTo(0, 1);

  background(51);

  $(".colorPickSelector").colorPick({
    initialColor: "#ecf0f1",
    allowRecent: false,
    palette: [
      "#ecf0f1",
      "#f1c40f",
      "#1abc9c",
      "#2980b9",
      "#9b59b6",
      "#34495e",
      "#2c3e50",
      "#c0392b",
      "#bdc3c7"
    ],
    onColorSelected: function() {
      this.element.css({ backgroundColor: this.color, color: this.color });
      current_color = this.color;
    }
  });

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

    stroke(data.color);
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

  $(".clear-button").click(() => {
    socket.emit("clear");
  });
  socket.on("clear-client", () => {
    background(51);
  });
}

function draw() {
  data = {
    x: mouseX,
    y: mouseY,
    color: current_color,
    newLine: false
  };

  if (mouseIsPressed && !color_picking) {
    points.push(createVector(mouseX, mouseY));
    stroke(current_color);
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

  socket.on("clients_counter", counter => {
    let users_text = document.querySelector(".online-users");
    users_text.innerHTML = `<i class="fas fa-users"></i> ${counter}`;
  });
}

function mouseReleased() {
  data.newLine = true;
  socket.emit("cords", data);
  points = [];
}

//js
