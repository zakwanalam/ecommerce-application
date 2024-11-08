import Navbar from "@/Home/components/navbar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { CardHeader } from "@material-tailwind/react";
import React, { useEffect, useState } from "react";
import Rating from "@mui/material/Rating";
import { useLocation } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import axios from "axios";
import { Skeleton } from "@mui/material";
import Review from "./components/Review";
import backArrow from '../assets/back.svg'
import { boolean } from "zod";
import { loadStripe } from "@stripe/stripe-js";
import { Toaster } from "@/components/ui/toaster";
import { toast, useToast } from "@/components/ui/use-toast";

function ProductPage(props) {
  const [user, setUser] = useState({});
  useEffect(() => {
    const getUser = async () => {
      const res = await axios.get("/api/getUser");
      const { user } = res.data;
      setUser(user);
    };
    getUser();
  }, []);


  const [rating, setValue] = useState(1);
  const [review, setReview] = useState("");
  const date = Date(Date.now());
  const [disable, setDisabled] = useState(false);
  const [imageURI, setImageURI] = useState("");
  useEffect(() => {
    console.log("Rting", rating);
  }, [rating]);

  const [quantity, setQuantity] = useState(1);

  const handleIncrement = () => {
    setQuantity((prev) => prev + 1)
  }
  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1)
    }
  }
  const location = useLocation();

  const { id, name, price, image, description, secondaryImage1, secondaryImage2, index } = location.state || {};

  const [animate, setAnimate] = useState(false)
  let [imageArray, setImageArray] = useState([image, secondaryImage1, secondaryImage2].filter(Boolean))
  let [imageCount, setImageCount] = useState(0)

  const moveToPreviousImage = () => {
    setAnimate(false)
    setTimeout(() => {
      setAnimate(true)
      if (imageCount > 0) {
        console.log('previous image');
        setImageCount(--imageCount);
      }
      else {
        setImageCount((imageArray.length - 1))
      }
    }, 30)

  }

  const moveToNextImage = () => {
    setAnimate(false)
    setTimeout(() => {
      setAnimate(true)
      setImageCount((imageCount + 1) % imageArray.length)

    }, 30)
  }



  const handleBuyNow = async () => {
    const stripe = await loadStripe('pk_test_51NDIgmQY69KQ4gJjN1tgyaVi6r5hi6L8l1BlEWQhdEoM8DR5NPC46Ql8ae3WkTwzpSXpBMX5qvpQzCK1g1LxaHmo00nuCOYQpr'); // Use your publishable key here
    try {
      const products = [{
        id: id,
        name: name,
        image_main: image,
        stock: {
          small: {
            price: price
          }
        },
        quantity: quantity,
      }]
      const tax = price * 13 / 100
      const shipping = 10
      const discount = 0
      const response = await axios.post('/api/checkout', {
        products: products,
        tax: tax,
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

  const {toast} = useToast()
  const addToCart = () => {
    props.addToCart(index, quantity)
    toast({
      title:`Item Added: ${name} `
    })

  }
  const [filteredReviews, setfilteredReviews] = useState([]);
  useEffect(() => {
    const profilePic = async () => {
      const res = await axios.get("/api/getProfilePic");
      setImageURI(res.data.profile_picture);
      console.log("mageeuri", res.data.profile_picture);
    };
    const getReviews = async () => {
      const res = await axios.get("/api/getReviews");
      setfilteredReviews(res.data.reviews.filter((review) => review.product_id === id));
    };
    profilePic();
    getReviews();
  }, []);
  useEffect(() => console.log("reviews", filteredReviews));
  console.log(name, price, image, description);

  const handleReviewSubmit = async () => {
    if (review === "") {
      return;
    }
    if (rating === 0) {
      return;
    }

    const feedback = {
      product_id: id,
      email: user.email || "",
      rating: rating || "",
      review: review || "",
      date: new Date(Date.now()),
    };

    setDisabled(true); // Disable button when submitting

    console.log("posted");
    const response = await axios.post("/api/saveReview", feedback);

    setTimeout(() => {
      setReview("");
      setValue(0);
      setValue(0); // Assuming setValue is used to update some other state
      setDisabled(false), 1000;
    }, 500);
  };
  useEffect(() => {
    console.log("disabled", disable), console.log("rating value", rating);
  });

  return (
    <>
      <section className="relative pt-36 lg:pl-36 top-5 bg-indigo-950 px-1 text-left ">
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mx-auto max-md:px-2 ">
            <div className="img">
              <div className="img-box h-full max-lg:mx-auto ">
                <div className='w-full  h-4/5 relative overflow-clip max-lg:w-full  max-lg:h-96 max-sm:max-h-[600px] '>
                  <img
                    src={imageArray[imageCount]}
                    className={`${animate ? 'animate-slide-in' : ''} object-cover shadow-lg absolute h-full w-full lg:rounded-2xl  max-lg:rounded-2xl    shadow-indigo-600/50 `}
                  />
                  <div onClick={moveToPreviousImage} className="w-1/2 opacity-0 flex items-center justify-center  translate-x-[-42%]  h-full scale-110   rounded-r-full bg-black/10 absolute transition-opacity duration-300 hover:opacity-100">
                    <img className="scale-[30%] absolute ml-10 opacity-60  aspect-square" src={backArrow} alt="" />
                  </div>
                  <div onClick={moveToNextImage} className="w-1/2 opacity-0 flex items-center justify-center translate-x-[+42%]  h-full scale-110 right-0  transition-opacity duration-300  rounded-l-full bg-black/10 absolute hover:opacity-100">
                    <img className="scale-[30%] absolute rotate-180  mr-10 opacity-60  aspect-square" src={backArrow} alt="" />
                  </div>
                </div>
                <div className='w-1/3 flex gap-4 mt-4'>
                  {
                    secondaryImage1 != '' ?
                      <img
                        src={secondaryImage1}
                        className="w-20 rounded-lg cursor-pointer aspect-square  "
                      />
                      : ''
                  }
                  {
                    secondaryImage2 != '' ?
                      <img
                        src={secondaryImage2}
                        className="w-20 cursor-pointer rounded-lg aspect-square  "
                      />
                      : ''
                  }
                </div>
              </div>
            </div>
            <div className="data w-full lg:pr-8 pr-0 xl:justify-start flex items-center max-lg:pb-10 xl:my-2 lg:my-5 my-0">
              <div className="data w-full max-w-xl">
                <p className="text-lg font-medium leading-8 text-orange-500 mb-4">
                  Shoes Collection
                </p>
                <h2 className="font-manrope font-bold text-3xl leading-10  text-white mb-2 capitalize">
                  {name}
                </h2>
                <div className="flex flex-col sm:flex-row sm:items-center mb-6">
                  <h6 className="font-manrope font-semibold text-2xl leading-9 text-white  pr-5 sm:border-r border-gray-200 mr-5">
                    ${price}
                  </h6>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <svg
                        width={20}
                        height={20}
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g clipPath="url(#clip0_12029_1640)">
                          <path
                            d="M9.10326 2.31699C9.47008 1.57374 10.5299 1.57374 10.8967 2.31699L12.7063 5.98347C12.8519 6.27862 13.1335 6.48319 13.4592 6.53051L17.5054 7.11846C18.3256 7.23765 18.6531 8.24562 18.0596 8.82416L15.1318 11.6781C14.8961 11.9079 14.7885 12.2389 14.8442 12.5632L15.5353 16.5931C15.6754 17.41 14.818 18.033 14.0844 17.6473L10.4653 15.7446C10.174 15.5915 9.82598 15.5915 9.53466 15.7446L5.91562 17.6473C5.18199 18.033 4.32456 17.41 4.46467 16.5931L5.15585 12.5632C5.21148 12.2389 5.10393 11.9079 4.86825 11.6781L1.94038 8.82416C1.34687 8.24562 1.67438 7.23765 2.4946 7.11846L6.54081 6.53051C6.86652 6.48319 7.14808 6.27862 7.29374 5.98347L9.10326 2.31699Z"
                            fill="#FBBF24"
                          />
                        </g>
                        <defs>
                          <clipPath id="clip0_12029_1640">
                            <rect width={20} height={20} fill="white" />
                          </clipPath>
                        </defs>
                      </svg>
                      <svg
                        width={20}
                        height={20}
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g clipPath="url(#clip0_12029_1640)">
                          <path
                            d="M9.10326 2.31699C9.47008 1.57374 10.5299 1.57374 10.8967 2.31699L12.7063 5.98347C12.8519 6.27862 13.1335 6.48319 13.4592 6.53051L17.5054 7.11846C18.3256 7.23765 18.6531 8.24562 18.0596 8.82416L15.1318 11.6781C14.8961 11.9079 14.7885 12.2389 14.8442 12.5632L15.5353 16.5931C15.6754 17.41 14.818 18.033 14.0844 17.6473L10.4653 15.7446C10.174 15.5915 9.82598 15.5915 9.53466 15.7446L5.91562 17.6473C5.18199 18.033 4.32456 17.41 4.46467 16.5931L5.15585 12.5632C5.21148 12.2389 5.10393 11.9079 4.86825 11.6781L1.94038 8.82416C1.34687 8.24562 1.67438 7.23765 2.4946 7.11846L6.54081 6.53051C6.86652 6.48319 7.14808 6.27862 7.29374 5.98347L9.10326 2.31699Z"
                            fill="#FBBF24"
                          />
                        </g>
                        <defs>
                          <clipPath id="clip0_12029_1640">
                            <rect width={20} height={20} fill="white" />
                          </clipPath>
                        </defs>
                      </svg>
                      <svg
                        width={20}
                        height={20}
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g clipPath="url(#clip0_12029_1640)">
                          <path
                            d="M9.10326 2.31699C9.47008 1.57374 10.5299 1.57374 10.8967 2.31699L12.7063 5.98347C12.8519 6.27862 13.1335 6.48319 13.4592 6.53051L17.5054 7.11846C18.3256 7.23765 18.6531 8.24562 18.0596 8.82416L15.1318 11.6781C14.8961 11.9079 14.7885 12.2389 14.8442 12.5632L15.5353 16.5931C15.6754 17.41 14.818 18.033 14.0844 17.6473L10.4653 15.7446C10.174 15.5915 9.82598 15.5915 9.53466 15.7446L5.91562 17.6473C5.18199 18.033 4.32456 17.41 4.46467 16.5931L5.15585 12.5632C5.21148 12.2389 5.10393 11.9079 4.86825 11.6781L1.94038 8.82416C1.34687 8.24562 1.67438 7.23765 2.4946 7.11846L6.54081 6.53051C6.86652 6.48319 7.14808 6.27862 7.29374 5.98347L9.10326 2.31699Z"
                            fill="#FBBF24"
                          />
                        </g>
                        <defs>
                          <clipPath id="clip0_12029_1640">
                            <rect width={20} height={20} fill="white" />
                          </clipPath>
                        </defs>
                      </svg>
                      <svg
                        width={20}
                        height={20}
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g clipPath="url(#clip0_12029_1640)">
                          <path
                            d="M9.10326 2.31699C9.47008 1.57374 10.5299 1.57374 10.8967 2.31699L12.7063 5.98347C12.8519 6.27862 13.1335 6.48319 13.4592 6.53051L17.5054 7.11846C18.3256 7.23765 18.6531 8.24562 18.0596 8.82416L15.1318 11.6781C14.8961 11.9079 14.7885 12.2389 14.8442 12.5632L15.5353 16.5931C15.6754 17.41 14.818 18.033 14.0844 17.6473L10.4653 15.7446C10.174 15.5915 9.82598 15.5915 9.53466 15.7446L5.91562 17.6473C5.18199 18.033 4.32456 17.41 4.46467 16.5931L5.15585 12.5632C5.21148 12.2389 5.10393 11.9079 4.86825 11.6781L1.94038 8.82416C1.34687 8.24562 1.67438 7.23765 2.4946 7.11846L6.54081 6.53051C6.86652 6.48319 7.14808 6.27862 7.29374 5.98347L9.10326 2.31699Z"
                            fill="#FBBF24"
                          />
                        </g>
                        <defs>
                          <clipPath id="clip0_12029_1640">
                            <rect width={20} height={20} fill="white" />
                          </clipPath>
                        </defs>
                      </svg>
                      <svg
                        width={20}
                        height={20}
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g clipPath="url(#clip0_8480_66029)">
                          <path
                            d="M9.10326 2.31699C9.47008 1.57374 10.5299 1.57374 10.8967 2.31699L12.7063 5.98347C12.8519 6.27862 13.1335 6.48319 13.4592 6.53051L17.5054 7.11846C18.3256 7.23765 18.6531 8.24562 18.0596 8.82416L15.1318 11.6781C14.8961 11.9079 14.7885 12.2389 14.8442 12.5632L15.5353 16.5931C15.6754 17.41 14.818 18.033 14.0844 17.6473L10.4653 15.7446C10.174 15.5915 9.82598 15.5915 9.53466 15.7446L5.91562 17.6473C5.18199 18.033 4.32456 17.41 4.46467 16.5931L5.15585 12.5632C5.21148 12.2389 5.10393 11.9079 4.86825 11.6781L1.94038 8.82416C1.34687 8.24562 1.67438 7.23765 2.4946 7.11846L6.54081 6.53051C6.86652 6.48319 7.14808 6.27862 7.29374 5.98347L9.10326 2.31699Z"
                            fill="#F3F4F6"
                          />
                        </g>
                        <defs>
                          <clipPath id="clip0_8480_66029">
                            <rect width={20} height={20} fill="white" />
                          </clipPath>
                        </defs>
                      </svg>
                    </div>
                    <span className="pl-2 font-normal leading-7 text-orange-400  text-sm ">
                      1624 review
                    </span>
                  </div>
                </div>
                <p className="text-white text-base font-normal mb-5">
                  {description}
                </p>
                <ul className="grid text-white gap-y-4 mb-8">
                  <li className="flex items-center gap-3">
                    <svg
                      width={26}
                      height={26}
                      viewBox="0 0 26 26"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <rect width={26} height={26} rx={13} fill="#4F46E5" />
                      <path
                        d="M7.66669 12.629L10.4289 15.3913C10.8734 15.8357 11.0956 16.0579 11.3718 16.0579C11.6479 16.0579 11.8701 15.8357 12.3146 15.3913L18.334 9.37183"
                        stroke="white"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                      />
                    </svg>
                    <span className="font-normal text-base  ">
                      Branded shirt
                    </span>
                  </li>
                  <li className="flex items-center gap-3">
                    <svg
                      width={26}
                      height={26}
                      viewBox="0 0 26 26"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <rect width={26} height={26} rx={13} fill="#4F46E5" />
                      <path
                        d="M7.66669 12.629L10.4289 15.3913C10.8734 15.8357 11.0956 16.0579 11.3718 16.0579C11.6479 16.0579 11.8701 15.8357 12.3146 15.3913L18.334 9.37183"
                        stroke="white"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                      />
                    </svg>
                    <span className="font-normal  ">
                      3 color shirt
                    </span>
                  </li>
                  <li className="flex items-center gap-3">
                    <svg
                      width={26}
                      height={26}
                      viewBox="0 0 26 26"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <rect width={26} height={26} rx={13} fill="#4F46E5" />
                      <path
                        d="M7.66669 12.629L10.4289 15.3913C10.8734 15.8357 11.0956 16.0579 11.3718 16.0579C11.6479 16.0579 11.8701 15.8357 12.3146 15.3913L18.334 9.37183"
                        stroke="white"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                      />
                    </svg>
                    <span className="font-normal text-base  ">
                      Pure Cotton Shirt with 60% as 40%
                    </span>
                  </li>
                  <li className="flex items-center gap-3">
                    <svg
                      width={26}
                      height={26}
                      viewBox="0 0 26 26"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <rect width={26} height={26} rx={13} fill="#4F46E5" />
                      <path
                        d="M7.66669 12.629L10.4289 15.3913C10.8734 15.8357 11.0956 16.0579 11.3718 16.0579C11.6479 16.0579 11.8701 15.8357 12.3146 15.3913L18.334 9.37183"
                        stroke="white"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                      />
                    </svg>
                    <span className="font-normal text-base ">
                      all size is available
                    </span>
                  </li>
                </ul>
                <p className="text-gray-900 text-lg leading-8 font-medium mb-4">
                  Size
                </p>
                <div className="w-full pb-8 border-b border-gray-100 flex-wrap">
                  <div className=":bg-orange-500  grid grid-cols-3 min-[400px]:grid-cols-5 gap-3 max-w-md">
                    <button className="bg-orange-500 text-center py-1.5 px-6 w-full font-semibold text-lg leading-8 text-white   flex items-center rounded-full justify-center transition-all duration-300 hover:bg-primary hover:shadow-sm hover:shadow-gray-100 hover:border-gray-300 visited:border-gray-300 visited:bg-gray-50">
                      41
                    </button>
                    <button className="bg-orange-500 text-center py-1.5 px-6 w-full font-semibold text-lg leading-8 text-white  flex items-center rounded-full justify-center transition-all duration-300 hover:bg-primary hover:shadow-sm hover:shadow-gray-100 hover:border-gray-300 visited:border-gray-300 visited:bg-gray-50">
                      42
                    </button>
                    <button className="bg-orange-500 text-center py-1.5 px-6 w-full font-semibold text-lg leading-8 text-white  flex items-center rounded-full justify-center transition-all duration-300 hover:bg-primary hover:shadow-sm hover:shadow-gray-100 hover:border-gray-300 visited:border-gray-300 visited:bg-gray-50">
                      43
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 py-8">
                  <div className="flex sm:items-center sm:justify-center w-full">
                    {/* decrease quanitity */}

                    <button id="decrementQuantity" onClick={handleDecrement} className="group py-4 px-6 border border-gray-400 rounded-l-full bg-white transition-all duration-300 hover:bg-gray-50 hover:shadow-sm hover:shadow-gray-300">
                      <svg
                        className="stroke-gray-900 group-hover:stroke-black"
                        width={22}
                        height={22}
                        viewBox="0 0 22 22"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M16.5 11H5.5"
                          stroke=""
                          strokeWidth="1.6"
                          strokeLinecap="round"
                        />
                        <path
                          d="M16.5 11H5.5"
                          stroke=""
                          strokeOpacity="0.2"
                          strokeWidth="1.6"
                          strokeLinecap="round"
                        />
                        <path
                          d="M16.5 11H5.5"
                          stroke=""
                          strokeOpacity="0.2"
                          strokeWidth="1.6"
                          strokeLinecap="round"
                        />
                      </svg>
                    </button>
                    <input
                      id="qntSelector"
                      readOnly
                      className="font-semibold cursor-pointer text-lg py-[13px] px-6 w-full sm:max-w-[118px] outline-0 border-y border-gray-400 bg-white placeholder:text-gray-900 text-center hover:bg-gray-50"
                      value={quantity}
                    />
                    {/* increase quanitity */}
                    <button id="incrementQuantity" onClick={handleIncrement} className="group py-4 px-6 border border-gray-400 rounded-r-full bg-white transition-all duration-300 hover:bg-gray-50 hover:shadow-sm hover:shadow-gray-300">
                      <svg
                        className="stroke-gray-900 group-hover:stroke-black"
                        width={22}
                        height={22}
                        viewBox="0 0 22 22"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M11 5.5V16.5M16.5 11H5.5"
                          stroke="#9CA3AF"
                          strokeWidth="1.6"
                          strokeLinecap="round"
                        />
                        <path
                          d="M11 5.5V16.5M16.5 11H5.5"
                          stroke="black"
                          strokeOpacity="0.2"
                          strokeWidth="1.6"
                          strokeLinecap="round"
                        />
                        <path
                          d="M11 5.5V16.5M16.5 11H5.5"
                          stroke="black"
                          strokeOpacity="0.2"
                          strokeWidth="1.6"
                          strokeLinecap="round"
                        />
                      </svg>
                    </button>
                  </div>
                  <button onClick={addToCart} className="group py-4 px-5 rounded-full bg-indigo-50 text-indigo-600 font-semibold text-lg w-full flex items-center justify-center gap-2 transition-all duration-500 hover:bg-indigo-100">
                    <svg
                      className="stroke-indigo-600 "
                      width={22}
                      height={22}
                      viewBox="0 0 22 22"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M10.7394 17.875C10.7394 18.6344 10.1062 19.25 9.32511 19.25C8.54402 19.25 7.91083 18.6344 7.91083 17.875M16.3965 17.875C16.3965 18.6344 15.7633 19.25 14.9823 19.25C14.2012 19.25 13.568 18.6344 13.568 17.875M4.1394 5.5L5.46568 12.5908C5.73339 14.0221 5.86724 14.7377 6.37649 15.1605C6.88573 15.5833 7.61377 15.5833 9.06984 15.5833H15.2379C16.6941 15.5833 17.4222 15.5833 17.9314 15.1605C18.4407 14.7376 18.5745 14.0219 18.8421 12.5906L19.3564 9.84059C19.7324 7.82973 19.9203 6.8243 19.3705 6.16215C18.8207 5.5 17.7979 5.5 15.7522 5.5H4.1394ZM4.1394 5.5L3.66797 2.75"
                        stroke=""
                        strokeWidth="1.6"
                        strokeLinecap="round"
                      />
                    </svg>

                    Add to cart
                  </button>
                  <Toaster/>


                </div>
                <div className="flex items-center gap-3">
                  <button className="group transition-all duration-500 p-4 rounded-full bg-indigo-50 hover:bg-indigo-100 hover:shadow-sm hover:shadow-indigo-300">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width={26}
                      height={26}
                      viewBox="0 0 26 26"
                      fill="none"
                    >
                      <path
                        d="M4.47084 14.3196L13.0281 22.7501L21.9599 13.9506M13.0034 5.07888C15.4786 2.64037 19.5008 2.64037 21.976 5.07888C24.4511 7.5254 24.4511 11.4799 21.9841 13.9265M12.9956 5.07888C10.5204 2.64037 6.49824 2.64037 4.02307 5.07888C1.54789 7.51738 1.54789 11.4799 4.02307 13.9184M4.02307 13.9184L4.04407 13.939M4.02307 13.9184L4.46274 14.3115"
                        stroke="#4F46E5"
                        strokeWidth="1.6"
                        strokeMiterlimit={10}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                  <button onClick={handleBuyNow} className="text-center w-full px-5 py-4 rounded-[100px] bg-indigo-600 flex items-center justify-center font-semibold text-lg text-white shadow-sm transition-all duration-500 hover:bg-indigo-700 hover:shadow-indigo-400">
                    Buy Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section
        id="testimonials"
        aria-label="What our customers are saying"
        className=" bg-indigo-950 pt-20  sm:pt-32"
      >
        <div className="mx-auto  max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl md:text-center">
            <h2 className="font-display  text-3xl tracking-tight text-white sm:text-4xl">
              Product Reviews
            </h2>
          </div>
          <ul
            role="list"
            className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-6 sm:gap-8 lg:mt-20 lg:max-w-none lg:grid-cols-3"
          >
            <li>
              <ul role="list" className="flex flex-col gap-y-6 sm:gap-y-8">
                <li>
                  <figure className="relative rounded-2xl bg-[#f3762e] p-6 shadow-xl shadow-slate-900/10">
                    <svg
                      aria-hidden="true"
                      width={105}
                      height={78}
                      className="absolute left-6 top-6 opacity-25 fill-slate-100"
                    >
                      <path d="M25.086 77.292c-4.821 0-9.115-1.205-12.882-3.616-3.767-2.561-6.78-6.102-9.04-10.622C1.054 58.534 0 53.411 0 47.686c0-5.273.904-10.396 2.712-15.368 1.959-4.972 4.746-9.567 8.362-13.786a59.042 59.042 0 0 1 12.43-11.3C28.325 3.917 33.599 1.507 39.324 0l11.074 13.786c-6.479 2.561-11.677 5.951-15.594 10.17-3.767 4.219-5.65 7.835-5.65 10.848 0 1.356.377 2.863 1.13 4.52.904 1.507 2.637 3.089 5.198 4.746 3.767 2.41 6.328 4.972 7.684 7.684 1.507 2.561 2.26 5.5 2.26 8.814 0 5.123-1.959 9.19-5.876 12.204-3.767 3.013-8.588 4.52-14.464 4.52Zm54.24 0c-4.821 0-9.115-1.205-12.882-3.616-3.767-2.561-6.78-6.102-9.04-10.622-2.11-4.52-3.164-9.643-3.164-15.368 0-5.273.904-10.396 2.712-15.368 1.959-4.972 4.746-9.567 8.362-13.786a59.042 59.042 0 0 1 12.43-11.3C82.565 3.917 87.839 1.507 93.564 0l11.074 13.786c-6.479 2.561-11.677 5.951-15.594 10.17-3.767 4.219-5.65 7.835-5.65 10.848 0 1.356.377 2.863 1.13 4.52.904 1.507 2.637 3.089 5.198 4.746 3.767 2.41 6.328 4.972 7.684 7.684 1.507 2.561 2.26 5.5 2.26 8.814 0 5.123-1.959 9.19-5.876 12.204-3.767 3.013-8.588 4.52-14.464 4.52Z"></path>
                    </svg>
                    <blockquote className="relative">
                      <p className="text-lg tracking-tight text-slate-900">
                        I love the fitness apparel and gear I purchased from
                        this site. The quality is exceptional and the prices are
                        unbeatable.
                      </p>
                    </blockquote>
                    <figcaption className="relative mt-6 flex items-center justify-between border-t border-slate-100 pt-6">
                      <div>
                        <div className="font-display text-base text-slate-900">
                          Sheryl Berge
                        </div>
                      </div>
                      <div className="overflow-hidden rounded-full bg-slate-50">
                        <img
                          alt=""
                          className="h-14 w-14 object-cover"
                          style={{ color: "transparent" }}
                          src="https://randomuser.me/api/portraits/men/15.jpg"
                        />
                      </div>
                    </figcaption>
                  </figure>
                </li>
              </ul>
            </li>
            <li>
              <ul role="list" className="flex flex-col gap-y-6 sm:gap-y-8">
                <li>
                  <figure className="relative rounded-2xl bg-[#f3762e] p-6 shadow-xl shadow-slate-900/10">
                    <svg
                      aria-hidden="true"
                      width={105}
                      height={78}
                      className="absolute left-6 top-6 opacity-25 fill-slate-100"
                    >
                      <path d="M25.086 77.292c-4.821 0-9.115-1.205-12.882-3.616-3.767-2.561-6.78-6.102-9.04-10.622C1.054 58.534 0 53.411 0 47.686c0-5.273.904-10.396 2.712-15.368 1.959-4.972 4.746-9.567 8.362-13.786a59.042 59.042 0 0 1 12.43-11.3C28.325 3.917 33.599 1.507 39.324 0l11.074 13.786c-6.479 2.561-11.677 5.951-15.594 10.17-3.767 4.219-5.65 7.835-5.65 10.848 0 1.356.377 2.863 1.13 4.52.904 1.507 2.637 3.089 5.198 4.746 3.767 2.41 6.328 4.972 7.684 7.684 1.507 2.561 2.26 5.5 2.26 8.814 0 5.123-1.959 9.19-5.876 12.204-3.767 3.013-8.588 4.52-14.464 4.52Zm54.24 0c-4.821 0-9.115-1.205-12.882-3.616-3.767-2.561-6.78-6.102-9.04-10.622-2.11-4.52-3.164-9.643-3.164-15.368 0-5.273.904-10.396 2.712-15.368 1.959-4.972 4.746-9.567 8.362-13.786a59.042 59.042 0 0 1 12.43-11.3C82.565 3.917 87.839 1.507 93.564 0l11.074 13.786c-6.479 2.561-11.677 5.951-15.594 10.17-3.767 4.219-5.65 7.835-5.65 10.848 0 1.356.377 2.863 1.13 4.52.904 1.507 2.637 3.089 5.198 4.746 3.767 2.41 6.328 4.972 7.684 7.684 1.507 2.561 2.26 5.5 2.26 8.814 0 5.123-1.959 9.19-5.876 12.204-3.767 3.013-8.588 4.52-14.464 4.52Z"></path>
                    </svg>
                    <blockquote className="relative">
                      <p className="text-lg tracking-tight text-slate-900">
                        As a professional athlete, I rely on high-performance
                        gear for my training. This site offers a great selection
                        of top-notch shoe collection
                      </p>
                    </blockquote>
                    <figcaption className="relative mt-6 flex items-center justify-between border-t border-slate-100 pt-6">
                      <div>
                        <div className="font-display text-base text-slate-900">
                          Leland Kiehn
                        </div>
                      </div>
                      <div className="overflow-hidden rounded-full bg-slate-50">
                        <img
                          alt=""
                          className="h-14 w-14 object-cover"
                          style={{ color: "transparent" }}
                          src="https://randomuser.me/api/portraits/women/15.jpg"
                        />
                      </div>
                    </figcaption>
                  </figure>
                </li>
              </ul>
            </li>
            <li>
              <ul role="list" className="flex flex-col gap-y-6 sm:gap-y-8">
                <li>
                  <figure className="relative rounded-2xl bg-[#f3762e] p-6 shadow-xl shadow-slate-900/10">
                    <svg
                      aria-hidden="true"
                      width={105}
                      height={78}
                      className="absolute left-6 top-6 opacity-25 fill-slate-100"
                    >
                      <path d="M25.086 77.292c-4.821 0-9.115-1.205-12.882-3.616-3.767-2.561-6.78-6.102-9.04-10.622C1.054 58.534 0 53.411 0 47.686c0-5.273.904-10.396 2.712-15.368 1.959-4.972 4.746-9.567 8.362-13.786a59.042 59.042 0 0 1 12.43-11.3C28.325 3.917 33.599 1.507 39.324 0l11.074 13.786c-6.479 2.561-11.677 5.951-15.594 10.17-3.767 4.219-5.65 7.835-5.65 10.848 0 1.356.377 2.863 1.13 4.52.904 1.507 2.637 3.089 5.198 4.746 3.767 2.41 6.328 4.972 7.684 7.684 1.507 2.561 2.26 5.5 2.26 8.814 0 5.123-1.959 9.19-5.876 12.204-3.767 3.013-8.588 4.52-14.464 4.52Zm54.24 0c-4.821 0-9.115-1.205-12.882-3.616-3.767-2.561-6.78-6.102-9.04-10.622-2.11-4.52-3.164-9.643-3.164-15.368 0-5.273.904-10.396 2.712-15.368 1.959-4.972 4.746-9.567 8.362-13.786a59.042 59.042 0 0 1 12.43-11.3C82.565 3.917 87.839 1.507 93.564 0l11.074 13.786c-6.479 2.561-11.677 5.951-15.594 10.17-3.767 4.219-5.65 7.835-5.65 10.848 0 1.356.377 2.863 1.13 4.52.904 1.507 2.637 3.089 5.198 4.746 3.767 2.41 6.328 4.972 7.684 7.684 1.507 2.561 2.26 5.5 2.26 8.814 0 5.123-1.959 9.19-5.876 12.204-3.767 3.013-8.588 4.52-14.464 4.52Z"></path>
                    </svg>
                    <blockquote className="relative">
                      <p className="text-lg tracking-tight text-slate-900">
                        The shoe collection I bought here fits perfectly and
                        feels amazing. I highly recommend this store to anyone
                        looking for quality sports shoes.
                      </p>
                    </blockquote>
                    <figcaption className="relative mt-6 flex items-center justify-between border-t border-slate-100 pt-6">
                      <div>
                        <div className="font-display text-base text-slate-900">
                          Peter Renolds
                        </div>
                      </div>
                      <div className="overflow-hidden rounded-full bg-slate-50">
                        <img
                          alt=""
                          className="h-14 w-14 object-cover"
                          style={{ color: "transparent" }}
                          src="https://randomuser.me/api/portraits/men/10.jpg"
                        />
                      </div>
                    </figcaption>
                  </figure>
                </li>
              </ul>
            </li>
          </ul>
          <div className="pb-5 pt-10  rounded-xl mt-12 ">
            {filteredReviews.length > 0 &&
              <div className="w-full ">
                <h1 className="text-2xl text-white  font-semibold pb-10 ">Product Reviews</h1>

                {filteredReviews.map((review, key) => {
                  return <Review review={review} />;
                })}
              </div>
            }
          </div>

        </div>
        <fieldset className="bg-indigo-900 py-20  px-5 xl:px-48 " disabled={props.loginStatus === 'Login' ? true : false}>
          <div className="pb-5 pt-10  text-white bg-indigo-500 shadow-indigo-800 shadow-2xl  rounded-xl  ">
            <h1 className="text-2xl font-semibold mb-8 ">Write A Review</h1>
            <div className="flex-col  justify-start items-start pl-9">
              <div className="flex">
                <Avatar>
                  <AvatarImage
                    src={imageURI && props.loginStatus === 'Logout' ? imageURI : "https://github.com/shadcn.png"}
                    alt="@shadcn"
                  />
                  <AvatarFallback
                    className={"bg-slate-200 animate-pulse duration-600"}
                  ></AvatarFallback>
                </Avatar>
                <div className="text-left flex-col justify-center">
                  <h1 className="pl-4  font-medium">{user?.fullName}</h1>
                  <h1 className="text-sm text-gray-400 pr-7 pl-4">{date}</h1>
                </div>
              </div>
              <div className="flex pt-4">
                <Rating
                  name="simple-controlled"
                  value={rating}
                  onChange={(event, newValue) => {
                    setValue(newValue);
                  }}
                ></Rating>
              </div>
            </div>
            <div className="flex-col pl-9 pr-9  text-white w-full justify-center pt-8 items-center mb-10 max-md:flex-col">
              <input
                placeholder={props.loginStatus === 'Login' ? 'Login to write review' : "Add a review"}
                id="input"
                value={review}
                style={{ borderWidth: '2px' }}
                onChange={(e) => setReview(e.target.value)}
                className={`w-full ${props.loginStatus === 'Login' ? 'placeholder:text-red-700' : ''} pb-32 placeholder:text-gray-200 border-gray-700  mb-8 bg-transparent rounded-md `}
                type="text"
              ></input>
              <Button
                disabled={disable}
                onClick={() => handleReviewSubmit()}
                className="mr-9 bg-indigo-800 hover:bg-orange-500 flex">
                Submit
              </Button>
            </div>
          </div>
        </fieldset>
        
      </section>
    </>
  );
}

export default ProductPage;
