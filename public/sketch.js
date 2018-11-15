let socket;
function loadImgErrFix(errEvt) {
  const pic = errEvt.target;

  if (!pic.crossOrigin) return p.print(`Failed to reload ${pic.src}!`);

  p.print(`Attempting to reload ${pic.src} as a tainted image now...`);
  (pic.crossOrigin = null), (pic.src = pic.src);
}

function setup() {
  createCanvas(400, 480);
  background(51);
  //socket client instance
  socket = io.connect(window.location.hostname);
  //setup a listener for broadcast
  socket.on("broadcast", data => {
    fill(255, 204, 0);
    noStroke();
    ellipse(data.x, data.y, 15, 15);
  });
  socket.on("broudcast_img", data => {
    loadImage(
      data.url,
      function(img) {
        image(img, data.x, data.y);
        console.log(data);
        let image = document.createElement("img");
        image.src = data.url;
      },
      loadImgErrFix
    );
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
