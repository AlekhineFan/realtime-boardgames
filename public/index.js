const btnPlay = document.querySelector("#btn-play");

btnPlay.addEventListener("click", () => {
  localStorage.removeItem("playerName");
  const name = document.querySelector("#player-name").value;
  localStorage.setItem("playerName", name);
});
