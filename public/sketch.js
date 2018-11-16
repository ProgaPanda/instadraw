let socket;

function setup() {
  createCanvas(400, 480);
  background(51);
  //socket client instance
  hostname =
    window.location.hostname == "localhost"
      ? "http://localhost:3000"
      : window.location.hostname;
  socket = io.connect(hostname);
  //setup a listener for broadcast
  socket.on("broadcast", data => {
    fill(255, 204, 0);
    noStroke();
    ellipse(data.x, data.y, 15, 15);
  });
  socket.on("broudcast_img", data => {
    loadImage(data.url, function(img) {
      image(img, data.x, data.y);
      console.log(data);
      let image = document.createElement("img");
      image.src = data.url;
    });
  });
}

function draw() {
  let img_url = document.querySelector("#imgURL").value;
  let data = {
    x: mouseX,
    y: mouseY
  };
  let data_img = {
    x: mouseX,
    y: mouseY,
    url: img_url
  };

  if (mouseIsPressed) {
    fill(255, 255, 255);

    noStroke();
    ellipse(mouseX, mouseY, 15, 15);

    //send the cordenator data
    socket.emit("cords", data);
    socket.emit("image", data_img);
  }
}
