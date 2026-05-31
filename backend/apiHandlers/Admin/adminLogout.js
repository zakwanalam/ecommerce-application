const adminLogout = (req, res) => {
  res.clearCookie('adminToken').send({ success: true });
};

export default adminLogout;
