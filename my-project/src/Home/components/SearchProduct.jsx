import useLoadingNavigation from "@/LoadingNavigation/LoadingNavigation";
import React from "react";
import { useNavigate } from "react-router-dom";

function SearchProduct({product,setProgress,onClick}) {
 
  return (
    <div
      onClick={onClick}
      className="py-3 w-[280px] text-center my-1 flex relative  text-black bg-gray-100 rounded-lg"
    >
      <img
        className="w-12 rounded-md ml-2 h-10"
        src={product.image_main}
        alt="Product Image"
      />
      <div className="flex ml-3 text-left flex-col">
        <h1 className="text-sm">{product.name}</h1>
        <p className="text-xs">{product.stock.small.price}</p>
      </div>
    </div>
  );
}

export default SearchProduct;
