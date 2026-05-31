const logout = (req, res) => {
  res.clearCookie("token").send({ success: true });
};

export default logout;
