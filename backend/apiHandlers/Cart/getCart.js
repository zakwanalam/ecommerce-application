import { default as jwt } from "jsonwebtoken";
import { db } from "../../config/db.js";

const getCart = (req, res) => {
  const email = jwt.decode(req.cookies.token).email;
  const query = `SELECT c.cart_item_id, p.*, s.stock_item_id, s.price, s.size, c.quantity
                FROM users as u 
                JOIN cart as c ON u.email = c.email
                JOIN product p ON p.id = c.product_id
                JOIN stock s ON s.stock_item_id = c.stock_item_id
                where u.email = ?`;
  try {
    db.query(query, email, (err, results) => {
      if (err) console.log(err);
      console.log('usrCart', results);
      res.send({ cart: results, success: true });
    });
  } catch (error) {
    console.log(error);
  }
};

export default getCart;
