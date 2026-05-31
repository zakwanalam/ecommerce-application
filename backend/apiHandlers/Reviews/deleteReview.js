import { db } from "../../config/db.js";

const deleteReview = (req, res) => {
  const { id } = req.query;
  const query = `DELETE from reviews where review_id=${id}`;
  try {
    db.query(query, (err) => {
      if (err) throw err;
      res.send({ success: true });
    });
  } catch (error) {
    console.log(error);
    res.send({ success: false });
  }
};

export default deleteReview;
