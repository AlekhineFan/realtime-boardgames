const imgSourceBlack = "./images/black-stone.png";
const imgSourceWhite = "./images/white-stone.png";

function createStone(square, color) {
  let stoneImg = document.createElement("img");
  stoneImg.setAttribute(
    "src",
    `${color === "white" ? imgSourceWhite : imgSourceBlack}`
  );
  stoneImg.setAttribute("class", "stone");
  square.appendChild(stoneImg);
}
