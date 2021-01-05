const btnPlay = document.querySelector("#btn-play");

btnPlay.addEventListener("click", () => {
  const name = document.querySelector("#player-name").value;
  localStorage.setItem("playerName", name);
});
