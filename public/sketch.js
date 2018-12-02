let socket;
let data;
let points = [];
let font;
let current_color;
let color_picking = false;
let isErasing = false;
let STROKE_WEIGHT = 4;
function preload() {
  font = loadFont("css/fonts/DancingScript-Bold.ttf");
}

function setup() {
  let canvas = createCanvas(window.innerWidth, window.innerHeight);
  canvas.parent("canvas");
  window.scrollTo(0, 1);

  background(51);

  var colorPicker = $(".colorPickSelector").colorPick({
    initialColor: "#ecf0f1",
    allowRecent: false,
    returnColor: "#000",
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
      returnColor = this.color;
    }
  });

  //check if in dev mode
  hostname =
    window.location.hostname == "localhost"
      ? "http://localhost:3000"
      : window.location.hostname;

  //socket client instance
  socket = io.connect(hostname);

  //load current drawing for the newly connected client
  socket.on("stored_drawing", data => {
    beginShape();
    strokeWeight(4);
    noFill();

    for (let i = 0; i < data.length; i++) {
      let x = data[i].x;
      let y = data[i].y;
      stroke(data[i].color);
      vertex(x, y);
      if (data[i].newLine) {
        endShape();
        beginShape();
      }
    }
  });

  //setup a listener for broadcast
  let points = [];
  socket.on("broadcast", data => {
    points.push(createVector(data.x, data.y));

    stroke(data.color);
    strokeWeight(data.strokeWeight);
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

  $(".eraser-button").on("click", function() {
    $(this).toggleClass("eraser-button-activated");
    //toggle between eraser and current color
    if (!isErasing) {
      current_color = "#333333";
      isErasing = true;
      STROKE_WEIGHT = 16;
    } else {
      current_color = returnColor;
      isErasing = false;
      STROKE_WEIGHT = 4;
    }
  });

  // socket.on("change_STROKE_WEIGHT", weight => {
  //   STROKE_WEIGHT = weight;
  // });

  $(".clear-button").click(() => {
    socket.emit("clear");
  });
  socket.on("clear-client", () => {
    background(51);
  });
  $(".save-button").click(() => {
    const id = Math.floor(random(13081997));
    save(`instadraw-${id}.png`);
  });
}

function draw() {
  data = {
    x: mouseX,
    y: mouseY,
    color: current_color,
    newLine: false,
    strokeWeight: STROKE_WEIGHT
  };

  if (mouseIsPressed && !color_picking) {
    points.push(createVector(mouseX, mouseY));
    stroke(current_color);
    strokeWeight(STROKE_WEIGHT);
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
