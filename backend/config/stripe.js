import Stripe from "stripe";
import { STRIPE_SECRET_KEY } from "./dotenv.js";

const stripe = Stripe(STRIPE_SECRET_KEY);

export default stripe;
