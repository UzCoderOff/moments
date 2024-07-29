export const isEmailAvaible = (email, users, setState, setEmail) => {
  const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
  setEmail(email);

  if (!emailRegex.test(email)) {
    setState(false);
    return false;
  }

  const user = users.find((user) => user.email === email);
  if (user) {
    setState(false);
    return false;
  }

  setState(true);
  return true;
};

