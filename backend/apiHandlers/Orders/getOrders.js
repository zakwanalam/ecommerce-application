import { db } from "../../config/db.js";
import stripe from "../../config/stripe.js";

const getOrders = (req, res) => {
  const getSessionQuery = 'SELECT stripe_session_id, total_price, status, order_date FROM orders';
  const getOrderProducts = 'SELECT product_id,product_name,unit_price,size,subtotal,quantity from orderview where stripe_session_id = ?';

  db.query(getSessionQuery, async (err, result) => {
    if (err) {
      console.error('Database Error:', err);
      return res.status(500).send({ success: false, msg: 'Database Error' });
    }
    try {
      const ordersWithDetails = await Promise.all(
        result.map(async (order) => {
          try {
            const { id, customer_details, payment_intent } = await stripe.checkout.sessions.retrieve(order.stripe_session_id);
            const lineItems = await stripe.checkout.sessions.listLineItems(order.stripe_session_id);
            const filteredLineItems = lineItems.data
              .filter((item) => item.description === 'Shipping' || item.description === 'Tax')
              .map((item) => ({ product_name: item.description, unit_price: parseFloat(item.amount_total) / 100 }));

            const paymentIntent = await stripe.paymentIntents.retrieve(payment_intent);
            const paymentMethodObject = await stripe.paymentMethods.retrieve(paymentIntent.payment_method);
            const productResult = await new Promise((resolve, reject) => {
              db.query(getOrderProducts, [order.stripe_session_id], (productError, productResult) => {
                if (productError) reject(productError);
                else resolve(productResult);
              });
            });
            filteredLineItems.forEach((item) => productResult.push(item));
            return { ...order, id, customer_details, card: paymentMethodObject.card.brand, last4: paymentMethodObject.card.last4, products: productResult };
          } catch (stripeError) {
            console.error('Stripe Error for Order:', order.stripe_session_id, stripeError);
            return { ...order, error: 'Failed to retrieve payment details' };
          }
        })
      );
      res.status(200).send({ success: true, result: ordersWithDetails, msg: 'Orders Retrieved Successfully' });
    } catch (error) {
      console.error('Unexpected Error:', error);
      res.status(500).send({ success: false, msg: 'Failed to retrieve orders' });
    }
  });
};

export default getOrders;
