import { db } from "../../config/db.js";

const getReviews = (req, res) => {
  const query = `SELECT 
                  u.profile_picture,
                  r.product_id, 
                  r.review_id,
                  r.date, 
                  r.email, 
                  u.fullName, 
                  r.rating, 
                  r.review_text, 
                  p.name,
                  p.image_main
              FROM 
                  reviews r
              JOIN 
                  users u ON r.email = u.email
              JOIN 
                  product p ON r.product_id = p.id`;

  try {
    db.query(query, (err, results) => {
      if (err) throw err;
      if (results.length > 0) {
        console.log(results);
        res.send({ success: true, reviews: results });
      }
    });
  } catch (error) {
    res.send({ success: false });
    console.log("Could Not Fetch Reviews", error);
  }
};

export default getReviews;
