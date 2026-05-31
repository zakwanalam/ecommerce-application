import { db } from "../../config/db.js";

const saveReview = (req, res) => {
  const { date, product_id, email, rating, review } = req.body;
  const query = `INSERT INTO reviews (product_id,email,rating,review_text,date) 
  VALUES('${product_id}','${email}','${rating}','${review}','${date}')`;
  try {
    db.query(query, (err) => {
      if (err) throw err;
      console.log(review, 'Review Sent');
      res.send({ success: true });
    });
  } catch (error) {
    res.send({ success: false });
    console.log(error);
  }
};

export default saveReview;
