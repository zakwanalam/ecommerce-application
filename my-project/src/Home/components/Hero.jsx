import React from "react";
import Navbar from "./navbar";
import Cart from "@/cart/cart";
import Product from "./Product";
import shoes from '../../assets/shoe.png'
import CarouselSlider from "./Carousel";
function Hero(props) {
  return (
    <>
      <div
        className="image-container pt-2 bg-indigo-950   w-full h-[650px] relative lg:h-[700px] md:h-[530px]"
      >
        <div className="w-[550px] mt-11 aspect-square top-[50%] translate-y-[-45%] right-36 rounded-full absolute bg-orange-500"></div>
        <img
          id="hero-image"
          src={shoes}
          alt="Your image"
        />
        {/* <div className="absolute w-full h-full bg-black/40"></div> */}
        <div className="heroBackground"></div>
          <div className="heroText">
            <div className="absolute flex w-full h-full flex-col w-85 items-start left-24 justify-center max-lg:items-center max-lg:left-0">
              <h1  className="text-orange-500  flex flex-col  text-left text-7xl leading-tight font-bold max-lg:text-center max-lg:text-5xl max-lg:leading-tight max-lg:pt-10 ">
                Best Quality Shoes! <div className="max-lg:italic max-lg:text-orange-500">
                Buy Now</div>
              </h1>
              <h3 className="text-2xl pt-5 font-light capitalize text-white">
                Quality shoes at affordable price
              </h3>
              <a href="#recentProducts">
                <button
                  className="mt-8 p-4 py-3 rounded-full text-white font-bold bg-orange-500 transition-all duration-150  hover:bg-primary  hover:scale-105 max-lg:px-4 max-lg:py-2 max-lg:text-sm"
                  size={"lg"}
                >
                  SHOP NOW!
                </button>
              </a>
            </div>
          </div>
        </div>
    </>
  );
}

export default Hero;
