const checkPlayerName = (pool, playerName) => {
  const names = pool.names;
  const trimmed = playerName.trim();

  console.log(names);

  if (names.includes(playerName)) {
    return 'nickname is currently in use';
  } else if (trimmed.length < 3) {
    return 'nickname is too short';
  } else if (trimmed.length > 10) {
    return 'nickname is too long';
  } else {
    return true;
  }
};

module.exports = checkPlayerName;
