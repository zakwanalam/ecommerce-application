import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import CartProduct from "./components.js/CartProduct";

import { useEffect, useState } from "react";
import axios from "axios";
import { loadStripe } from "@stripe/stripe-js";
import { ReloadIcon } from "@radix-ui/react-icons";

export default function Cart(props) {
  const [quantity, setQuantity] = useState(1);

  const h = [];

  const [subtotal, setSubTotal] = useState(0);
  const [shipping, setShipping] = useState();
  const [tax, setTax] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [total, setTotal] = useState(0);
  const [disable, setDisable] = useState((props.cart.length > 0) ? false : true)


  useEffect(() => {

    let x = 0;
    props.cart.forEach((product) => {
      x += (product.price * product.quantity);
    });
    setSubTotal(Math.round(x));
    setTax((subtotal * 13) / 100);
    setDiscount(0);
    setShipping(10);
    const total = parseFloat([subtotal + shipping + tax + discount]).toFixed(2)
    setTotal("$" + total.toString());

    setDisable(props.cart.length === 0 || clicked)

  });


  const increment = () => {
    setQuantity((prevQuantity) => prevQuantity + 1);
  };

  const decrement = () => {
    if (quantity > 1) {
      setQuantity((prevQuantity) => prevQuantity - 1);
    }
  };



  const [clicked, setClicked] = useState(false)

  const handleCheckout = async () => {
    setClicked((prev) => true)
    setDisable((prev) => true)
    const stripe = await loadStripe('pk_test_51NDIgmQY69KQ4gJjN1tgyaVi6r5hi6L8l1BlEWQhdEoM8DR5NPC46Ql8ae3WkTwzpSXpBMX5qvpQzCK1g1LxaHmo00nuCOYQpr'); // Use your publishable key here
    try {
      const response = await axios.post('/api/checkout', {
        products: props.cart, tax: tax,
        discount: discount,
        shipping: shipping,
      });

      console.log('checout ongoing');

      const result = await stripe.redirectToCheckout({
        sessionId: response.data.id,
      });

      if (result.error) {
        console.error(result.error.message);
      }
    } catch (error) {
      console.error('Error during checkout:', error);
    }
  }
  return (
    <div
      className={`w-96 flex backdrop-blur-lg h-screen z-30 bg-white fixed top-0 max-sm:h-screen ${props.animation}`}
    >
      <div className="h-full w-full shadow-lg absolute ">
        <div className="h-16 bg-indigo-500 text-lg font-semibold text-white shadow-xl  w-full flex items-center text-left">
          <div className="flex justify-start items-center pl-4">
            <svg
              height="20px"
              version="1.1"
              viewBox="0 0 20 20"
              width="20px"
              xmlns="http://www.w3.org/2000/svg"
              xmlns:sketch="http://www.bohemiancoding.com/sketch/ns"
              xmlns:xlink="http://www.w3.org/1999/xlink"
            >
              <title />
              <desc />
              <defs />
              <g
                fill="none"
                fill-rule="evenodd"
                id="Page-1"
                stroke="none"
                stroke-width="1"
              >
                <g
                  fill="#FFFFFF"
                  id="Core"
                  transform="translate(-212.000000, -422.000000)"
                >
                  <g
                    id="shopping-cart"
                    transform="translate(212.000000, 422.000000)"
                  >
                    <path
                      d="M6,16 C4.9,16 4,16.9 4,18 C4,19.1 4.9,20 6,20 C7.1,20 8,19.1 8,18 C8,16.9 7.1,16 6,16 L6,16 Z M0,0 L0,2 L2,2 L5.6,9.6 L4.2,12 C4.1,12.3 4,12.7 4,13 C4,14.1 4.9,15 6,15 L18,15 L18,13 L6.4,13 C6.3,13 6.2,12.9 6.2,12.8 L6.2,12.7 L7.1,11 L14.5,11 C15.3,11 15.9,10.6 16.2,10 L19.8,3.5 C20,3.3 20,3.2 20,3 C20,2.4 19.6,2 19,2 L4.2,2 L3.3,0 L0,0 L0,0 Z M16,16 C14.9,16 14,16.9 14,18 C14,19.1 14.9,20 16,20 C17.1,20 18,19.1 18,18 C18,16.9 17.1,16 16,16 L16,16 Z"
                      id="Shape"
                    />
                  </g>
                </g>
              </g>
            </svg>
            <h2 className="ml-4 align-middle ">Your Cart</h2>
            <div onClick={() => { props.setShowCart(false) }} className={`w-6 h-6 flex items-center absolute right-5 cursor-pointer`}>
              <svg
                id="Outlined"
                viewBox="0 0 32 32"
                xmlns="http://www.w3.org/2000/svg"
              >
                <title />
                <g id="Fill">
                  <polygon fill="#FFFFFF" points="28.71 4.71 27.29 3.29 16 14.59 4.71 3.29 3.29 4.71 14.59 16 3.29 27.29 4.71 28.71 16 17.41 27.29 28.71 28.71 27.29 17.41 16 28.71 4.71" />
                </g>
              </svg>
            </div>
          </div>
        </div>
        <ScrollArea className="w-full h-[34rem] rounded-md">
          <div>
            <ul
              className={`px-4 py-4 pt-6 ${props.cart[0] === undefined
                  ? "h-[34rem] flex items-center justify-center"
                  : ""
                }`}
            >
              {props.cart[0] === undefined ? (
                <div className="text-2xl font-bold text-black/60">
                  No items in cart
                </div>
              ) : null}
              {props.cart.map((product, i) => {
                return (
                  <>
                    <CartProduct
                      setProductQuantity={props.setProductQuantity}
                      index={i}
                      cart={props.cart}
                      removeFromCart={props.removeFromCart}
                      product={product}
                    />
                  </>
                );
              })}
            </ul>
          </div>
        </ScrollArea>
        <div className="w-full bg-black/30" style={{ height: "1px" }}></div>
        <div className="pl-4 pr-4 pt-5">
          <ul className="text-sm text-gray-700">
            <li className="flex justify-between mb-2">
              <h5>Subtotal</h5>
              <h5>{subtotal}</h5>
            </li>
            <li className="flex justify-between mb-2">
              <h5>Shipping</h5>
              <h5>{shipping}</h5>
            </li>
            <li className="flex justify-between mb-2">
              <h5>Tax</h5>
              <h5>{tax}</h5>
            </li>
            <li className="flex justify-between mb-2">
              <h5>Discount</h5>
              <h5>{discount}</h5>
            </li>
            <li className="flex font-bold text-indigo-500 justify-between mb-2">
              <h5>Total</h5>
              <h5>{total}</h5>
            </li>
            <li className="flex justify-end  py-4">
              <Button disabled={disable} onClick={handleCheckout} className={`bg-indigo-600  hover:bg-indigo-700`}>
                Proceed to Checkout
                {disable && clicked ? <ReloadIcon className="ml-2 animate-spin" /> : null}
              </Button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
