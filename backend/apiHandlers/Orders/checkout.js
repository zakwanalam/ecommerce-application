import { default as jwt } from "jsonwebtoken";
import stripe from "../../config/stripe.js";
import { SERVER_IP } from "../../config/dotenv.js";

const checkout = async (req, res) => {
  try {
    const { products, tax, discount, shipping } = req.body;
    console.log("checkout", products);

    const lineItems = products.map((product) => ({
      price_data: {
        currency: "usd",
        product_data: { name: product.name, images: [product.image_main], metadata: { product_id: product.id } },
        unit_amount: Math.round(product.price * 100),
      },
      quantity: product.quantity,
    }));

    if (tax > 0) lineItems.push({ price_data: { currency: "usd", product_data: { name: "Tax" }, unit_amount: Math.round(tax * 100) }, quantity: 1 });
    if (discount > 0) lineItems.push({ price_data: { currency: "usd", product_data: { name: "Discount" }, unit_amount: Math.round(-discount * 100) }, quantity: 1 });
    if (shipping > 0) lineItems.push({ price_data: { currency: "usd", product_data: { name: "Shipping" }, unit_amount: Math.round(shipping * 100) }, quantity: 1 });

    const { email } = jwt.decode(req.cookies.token);
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `http://${SERVER_IP}:3000/api/storeOrder?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `http://${SERVER_IP}:5173/paymentFail`,
      billing_address_collection: "required",
      phone_number_collection: { enabled: true },
      customer_email: email,
    });
    console.log('session id is:', session.id);
    res.send({ id: session.id });
  } catch (error) {
    console.error("Error creating Stripe checkout session:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export default checkout;
