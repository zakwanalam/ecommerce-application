import React, { useEffect, useState } from "react";
import Product from "./Product";
import ProductPage from "@/ProductPage/product";
import { Navigate, useNavigate } from "react-router-dom";
import { useInView } from "react-intersection-observer";
function RecentProducts(props) {
  
  const handleIntersection = (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate');
      } else {
        entry.target.classList.remove('animate');
      }
    });
  };
  // Set up intersection observer
  const { ref: observerRef } = useInView({
    triggerOnce: true,
    threshold: 0.1,
    onChange: handleIntersection
  });
  const[isCLicked,setClicked] = useState(false)
  const navigate = useNavigate()
  return (
    <>
      <div

        style={{ zIndex: "-1" , }}
        className="flex bg-indigo-950 relative flex-col pt-14 items-center justify-center"
      >
        <h3 className="text-4xl text-white flex font-bold"> Our Products</h3>
        <div className="mt-5 w-20 h-1 bg-white"></div>
      </div>
      <div   className={`pb-10 flex px-20 bg-indigo-950 items-center justify-center flex-wrap`}>
        {props.productList===null?<Popup/>: props.productList.map((product, i) => {
          return (
            <>
              <div ref={observerRef}  style={{ zIndex: "0" }} id="recentProducts" className={` pt-6  ${i % 2 === 0 ? "mx-10" : null} `}>
                <Product
                  isProductSelected = {props.isProductSelected}
                  addToCart={props.addToCart}
                  product={product}
                  setProgress={props.setProgress}
                  key={i}
                  index={i}
                />
              </div>
            </>
          );
        })}
      </div>
    </>
  );
}

export default RecentProducts;
