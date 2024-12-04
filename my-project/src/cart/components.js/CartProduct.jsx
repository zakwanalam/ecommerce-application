import React, { useEffect } from "react";
import { useState } from "react";

function CartProduct(props) {
  
  const [quantity, setQuantity] = useState(props.product.quantity||0);
  console.log('product',props.product);
  
  const increment = () => {
    setQuantity(quantity+1);
    props.setProductQuantity(props.product.cart_item_id,quantity+1,props.index)
  };
  
  const decrement = () => {
    if (quantity > 1) {
      setQuantity(quantity-1);
    }
  };
  useEffect(()=>{
    props.setProductQuantity(props.product.cart_item_id,quantity,props.index)
  },[quantity])
  const obj = [{
    a:'dad',
    b:'adad',
  }]
  return (
    <li className="mt-3 mb-6">
      <div className="flex w-full h-16">
        {/* IMAGE */}
        <div className="w-24">
          <img
            className="w-full rounded-sm h-full object-cover"
            src={props.product.image_main}
            alt=""
          />
        </div>
        <div className="w-full h-full flex  ml-3 mr-3 pt-0 pb-0.5 flex-col justify-between">
          <h3 className="text-left text-sm font-semibold text-indigo-500">{props.product.name}</h3>
          <div className="text-sm flex justify-between items-center ">
            <h4 className="text-sm font-semibold">${props.product.price}</h4>
            <h4 className="text-xs bg-slate-100 p-1 rounded font-normal">Size: {props.product.size}</h4>

            <div className="flex items-center space-x-2">
              <button
                onClick={decrement}
                className="px-2 py-0.5 bg-gray-200 text-black rounded hover:bg-gray-300"
              >
                -
              </button>
              <span className="text-sm font-semibold">{quantity}</span>
              <button
                onClick={increment}
                className="px-1.5 py-0.5 text-sm bg-gray-200 text-black rounded hover:bg-gray-300"
              >
                +
              </button>
            </div>
            <div on className="flex justify-center items-center cursor-pointer" onClick={()=>{const index = props.cart.indexOf(props.product); 
              props.removeFromCart(props.product.cart_item_id,index,props.product.id,props.product.stock_item_id)}}>
              {" "}
              <svg
                enable-background="new 0 0 512 512"
                height="15px"
                id="Layer_1"
                version="1.1"
                viewBox="0 0 512 512"
                width="15px"
                xml:space="preserve"
                xmlns="http://www.w3.org/2000/svg"
                xmlns:xlink="http://www.w3.org/1999/xlink"
              >
                <g>
                  <path
                    d="M444.852,66.908h-99.339V47.04c0-21.943-17.792-39.736-39.736-39.736h-99.339   c-21.944,0-39.736,17.793-39.736,39.736v19.868H67.363v19.868h20.47l19.887,377.489c0,21.944,17.792,39.736,39.736,39.736h218.546   c21.944,0,39.736-17.792,39.736-39.736l19.538-377.489h19.577V66.908z M186.57,47.04c0-10.962,8.926-19.868,19.868-19.868h99.339   c10.962,0,19.868,8.906,19.868,19.868v19.868H186.57V47.04z M385.908,463.236l-0.039,0.505v0.524   c0,10.943-8.906,19.868-19.868,19.868H147.455c-10.942,0-19.868-8.925-19.868-19.868v-0.524l-0.019-0.523L107.72,86.776h297.669   L385.908,463.236z"
                    fill="#37404D"
                  />
                  <rect
                    fill="#37404D"
                    height="317.885"
                    width="19.868"
                    x="246.173"
                    y="126.511"
                  />
                  <polygon
                    fill="#37404D"
                    points="206.884,443.757 186.551,126.493 166.722,127.753 187.056,445.017  "
                  />
                  <polygon
                    fill="#37404D"
                    points="345.649,127.132 325.82,125.891 305.777,443.776 325.606,445.017  "
                  />
                </g>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </li>
  );
}

export default CartProduct;
