import { db } from "../../config/db.js";

const updateCartItemQuantity = (req, res) => {
  const { cart_item_id, quantity } = req.body;
  console.log(cart_item_id, quantity);

  const query = 'UPDATE cart SET quantity = ? WHERE cart_item_id = ?';
  try {
    db.query(query, [quantity, cart_item_id], (err, results) => {
      if (err) throw err;
      else if (results.affectedRows > 0) {
        console.log('Cart Item Quantity Updated Successfully');
        res.send({ success: true });
      }
    });
  } catch (error) {
    console.log(error);
    res.send({ success: false });
  }
};

export default updateCartItemQuantity;
