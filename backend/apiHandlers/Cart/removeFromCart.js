import { default as jwt } from "jsonwebtoken";
import { db } from "../../config/db.js";

const removeFromCart = async (req, res) => {
  const { cart_item_id, product_id, stock_item_id } = req.body;
  console.log(cart_item_id);

  const deleteFromCartId = `DELETE FROM cart WHERE cart_item_id = ${cart_item_id}`;
  const deleteFromPrimary = 'DELETE FROM cart where email=? and product_id=? and stock_item_id = ?';
  const { token } = req.cookies;
  const email = jwt.decode(token).email;

  try {
    if (cart_item_id) {
      db.query(deleteFromCartId, (err, results) => {
        if (err) {
          console.log("Cart Id Not Found", err.code);
          return res.status(500).json({ success: false, msg: 'Failed to delete by cart_item_id' });
        } else if (results.length > 0) {
          return res.status(200).json({ success: true, msg: 'Cart item deleted successfully' });
        }
      });
    } else {
      db.query(deleteFromPrimary, [email, product_id, stock_item_id], (err) => {
        if (err) {
          console.log("Cart Id Not Found", err.code);
          return res.status(500).json({ success: false, msg: 'Failed to delete item' });
        } else {
          return res.status(200).json({ success: true, msg: 'Cart item deleted successfully' });
        }
      });
    }
  } catch (error) {
    return res.status(500).json({ success: false, msg: 'An unexpected error occurred' });
  }
};

export default removeFromCart;
