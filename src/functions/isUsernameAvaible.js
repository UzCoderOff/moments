export const isUsernameAvailable = async (newUsername, setIsUserAv, setUserName, allUsers, currentUsername) => {
  const regex = /^[a-zA-Z0-9_.]{3,}$/;

  if (!regex.test(newUsername) || newUsername.toLowerCase() === "login" || newUsername.toLowerCase() === "signup" || newUsername.toLowerCase() === "explore") {
    setIsUserAv(false);
    return Promise.resolve(false);
  }

  setUserName(newUsername);

  if (newUsername === currentUsername) {
    setIsUserAv(true);
    return Promise.resolve(true);
  }

  const usernameTaken = allUsers.some(
    (user) => user.username.toLowerCase() === newUsername.toLowerCase()
  );
  setIsUserAv(!usernameTaken);
  return Promise.resolve(!usernameTaken);
};
