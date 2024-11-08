"use-client";
import { Skeleton } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import DelayedRender from "./DelayedRender";
import loadingNavigation from "@/LoadingNavigation/LoadingNavigation";
import useLoadingNavigation from "@/LoadingNavigation/LoadingNavigation";
import { Toaster } from "@/components/ui/toaster";
import { toast } from "@/components/ui/use-toast";

function Product(props) {
  const query = {
    index:props.index,
    id: props.product.id,
    name: props.product.name,
    price: props.product.stock.small.price,
    image: props.product.image_main,
    secondaryImage1:props.product.image_secondary_1,
    secondaryImage2:props.product.image_secondary_2,
    description: props.product.description,
  };

  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    console.log(imageLoaded);
  }, [imageLoaded]);


  const loadingNavigation = useLoadingNavigation(props.setProgress)
  return (
    <>
      <div id="product" className="transition-all duration-300 hover:scale-105">
        <div
          style={{
            WebkitBackdropFilter: "blur(10px)",
            borderWidth: "1px",
          }}
          className=" bg-white bg-blend-color-burn     border-indigo-600  backdrop-blur-lg stroke-indigo-800  relative flex   flex-col overflow-hidden rounded-lg border shadow-md"
        >
          <div
            className=" mx-3  relative mt-3 flex sm:h-64 max-sm:h-32 overflow-hidden cursor-pointer rounded-xl"
            onClick={() => {
              props.isProductSelected();
              loadingNavigation('/product',query)
            }}
          >
            <img
              className="object-cover w-full h-full"
              src={props.product.image_main}
              hidden={!imageLoaded}
              id="image"
              onLoad={() => {
                setImageLoaded(true);
              }}
              alt="product image"
            />
            <div
              hidden={imageLoaded}
              className="absolute w-full h-full bg-slate-200/80 animate-pulse "
            />
            <span className="absolute top-0 left-0 m-2 rounded-full bg-black px-2 text-center text-sm font-medium text-white">
              39% OFF
            </span>
          </div>
      
          <div className="mt-4 px-5 pb-5">
            <a>
              <h5 className="text-xl text-slate-800 tracking-tight text-slate-900">
                {props.product.name}
              </h5>
            </a>
            <div className="mt-2 mb-5 flex items-center justify-between">
              <p>
                <span className="text-3xl  font-bold text-slate-800 max-sm:text-[21px]">
                  ${props.product.stock.small.price}
                </span>
                <span className="text-sm text-slate-white line-through">
                  ${props.product.original}
                </span>
              </p>
              <div className="flex items-end max-sm:pl-2 max-sm:scale-75 max-sm:flex-col max-sm:justify-center">
                <div className="flex mb-2">
                  <svg
                    aria-hidden="true"
                    className="h-5 w-5 text-yellow-300"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <svg
                    aria-hidden="true"
                    className="h-5 w-5 text-yellow-300"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <svg
                    aria-hidden="true"
                    className="h-5 w-5 text-yellow-300"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <svg
                    aria-hidden="true"
                    className="h-5 w-5 text-yellow-300"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <svg
                    aria-hidden="true"
                    className="h-5 w-5 text-yellow-300"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
                <span className=" ml-3 rounded  bg-yellow-200 px-2.5 py-0.5 text-xs font-semibold">
                  5.0
                </span>
              </div>
            </div>
            <a
              onClick={() => {
                props.addToCart(props.product.id,props.index);
                toast({
                  title:`Item Added: ${query.name}`
                })
              }}
              className="flex cursor-pointer items-center justify-center rounded-md max-sm:text-xs  bg-indigo-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-indigo-500 focus:outline-none focus:ring-4 focus:ring-blue-300"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="mr-2 h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              Add to cart
            </a>
            
          </div>
        </div>
      </div>
      <Toaster/>

    </>
  );
}

export default Product;
