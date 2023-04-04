const createTokenUser = (user) => {
  return {
    name: user.name,
    role: user.role,
    userId: user._id,
    email: user.email,
  };
};

module.exports = createTokenUser;
