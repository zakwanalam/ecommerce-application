import { db } from "../../config/db.js";
import stripe from "../../config/stripe.js";
import { sendOrderConfirmationEmail } from "../../sendOrderConfirmationEmail.js";

const storeOrder = async (req, res) => {
  const { session_id } = req.query;
  const session = await stripe.checkout.sessions.retrieve(session_id);
  const amount_total = session.amount_total;
  const email = session.customer_details.email;
  const date = new Date(session.created * 1000);

  const getCartQuery = `SELECT c.cart_item_id, p.*, s.stock_item_id, s.price, s.size, c.quantity
      FROM users as u
      JOIN cart as c ON u.email = c.email
      JOIN product p ON p.id = c.product_id
      JOIN stock s ON s.stock_item_id = c.stock_item_id
      WHERE u.email = ?`;

  try {
    db.query(getCartQuery, email, (err, cart) => {
      if (err) {
        console.log(err);
        return res.status(500).send({ success: false, msg: 'Error fetching cart' });
      }
      const query = 'INSERT INTO orders (email, order_date, status, total_price, stripe_session_id) VALUES (?, ?, ?, ?, ?)';
      db.query(query, [email, date, 'Processing', amount_total / 100, session_id], async (err) => {
        if (err) {
          console.log(err);
          return res.status(500).send({ success: false, msg: 'Error creating order' });
        }
        const order_items_query = `INSERT INTO order_items (stripe_session_id, stock_item_id, quantity, unit_price) VALUES (?, ?, ?, ?)`;
        cart.forEach(product => {
          db.query(order_items_query, [session_id, product.stock_item_id, product.quantity, product.price], (err) => {
            if (err) console.log(err);
          });
        });
        let response = false;
        let maxRetries = 3;
        let attempts = 0;
        while (!response && attempts <= maxRetries) {
          attempts++;
          response = await sendOrderConfirmationEmail(cart, email);
        }
        res.redirect(`http://localhost:5173/paymentSuccess?session_id=${session_id}`);
      });
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, msg: 'Server error' });
  }
};

export default storeOrder;
