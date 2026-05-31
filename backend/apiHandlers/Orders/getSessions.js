import stripe from "../../config/stripe.js";

const getSessions = async (req, res) => {
  const sessions = await stripe.checkout.sessions.list({ limit: 16 });
  res.json({ sessions: sessions.length });
};

export default getSessions;
