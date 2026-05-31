import { default as jwt } from "jsonwebtoken";
import { db } from "../../config/db.js";

const addToCart = (req, res) => {
  const { productId, quantity, stock_item_id } = req.body;
  console.log('id', productId);
  console.log('quantity', quantity);

  const { email } = jwt.decode(req.cookies.token);
  const query = `INSERT INTO cart (email,product_id,quantity,stock_item_id) VALUES(?,?,?,?)`;
  db.query(query, [email, productId, quantity, stock_item_id], (err, results) => {
    if (err) {
      console.log(err.code);
      return res.status(401).send('Duplicate Entry');
    }
    if (results.affectedRows > 0) {
      console.log("Product Added To Cart", results.insertId);
      res.send({ success: true, cart_item_id: results.insertId });
    } else {
      res.send("Error While storing cart");
    }
  });
};

export default addToCart;
