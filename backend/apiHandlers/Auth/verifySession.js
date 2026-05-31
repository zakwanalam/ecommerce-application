const verifySession = (req, res) => {
  const { token } = req.cookies;
  try {
    if (token) {
      res.status(201).send({ success: true });
    } else {
      res.status(205).send({ success: false });
    }
  } catch (error) {
    console.log(error);
  }
};

export default verifySession;
