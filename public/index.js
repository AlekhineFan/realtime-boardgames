const btnPlay = document.querySelector('#btn-play');
const formInfo = document.querySelector('#warning');

btnPlay.addEventListener('click', async e => {
  e.preventDefault();
  let playerName = document.querySelector('#player-name').value;
  localStorage.setItem('playerName', playerName);
  await axios
    .get(`/play/${playerName}`)
    .then(res => {
      console.log(res.statusText);
      document.open();
      document.write(res.data);
      document.close();
    })
    .catch(err => {
      const error = err.response.data;
      if (error.toString().length > 30) {
        formInfo.innerText = 'please provide a nickname';
      } else {
        formInfo.innerText = error;
      }
      setTimeout(() => {
        formInfo.innerText = '';
      }, 4000);
    });
});
