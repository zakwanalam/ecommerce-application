import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SearchProduct from "./SearchProduct";
import useLoadingNavigation from "@/LoadingNavigation/LoadingNavigation";

function SearchBar({ productList, setProgress,searchIconClicked=false ,animate}) {
  const [value, setValue] = useState("");
  const handleSearch = (e) => {
    const query = e.target.value;
    // Populate the div with content based on the search query
    // Remove the 'hidden' class to show the div
    setValue(query);

    const resultDiv = document.getElementById("result-div");
    if (query != "") {
      resultDiv.style.opacity = 100;
    } else {
      resultDiv.style.opacity = 0;
    }
  };
  const [filteredProducts, setFilteredProducts] = useState([]);
  useEffect(() => {
    setFilteredProducts(
      productList.filter((product) =>
        product.name.toLowerCase().includes(value)
      )
    );
    console.log(filteredProducts);
  }, [value]);
  const loadingNavigate = useLoadingNavigation(setProgress);
  
  return (
    <>
      <div className={`relative  rounded-3xl shadow-xl max-md:opacity-0 max-md:absolute ${animate? (searchIconClicked===true ? 'visible max-md:animate-slide-inY':' max-md:animate-slide-outY'):''} max-md:absolute max-md:bg-indigo-700 max-md:p-3 max-md:rounded-xl max-md:mt-8 max-md:-z-40 max-md:right-0`}>
        <div class="mx-auto ">
          <form action="" class="relative mx-auto w-max">
            <input
              type="search"
              id="searchInput"
              placeholder="Search Products"
              value={value}
              onChange={handleSearch}
              class="peer cursor-pointer placeholder:text-white relative z-10 h-12  w-12 rounded-full border bg-transparent pl-12 outline-none w-full  focus:cursor-text focus:border-lime-300 focus:pl-16 focus:pr-4"
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="absolute inset-y-0 my-auto h-8 w-12 border-r border-transparent stroke-gray-100 px-3.5 peer-focus:border-lime-300 peer-focus:stroke-lime-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </form>
        </div>
      </div>
      {filteredProducts.length > 0 && value!='' ? (
        <form
          id="result-div"
          style={{ zIndex: 500 }}
          className="overflow-y-auto absolute max-md:right-0 max-md:top-36 max-md:p-3   bg-slate-200 p-2  mt-3 rounded-md max-h-60 flex  flex-col opacity-0 "
        >
          {filteredProducts.map((product) => {
            const query = {
              id: product.id,
              name: product.name,
              price: product.stock[0].price,
              stock:product.stock,
              image: product.image_main,
              secondaryImage1:product.image_secondary_1,
              secondaryImage2:product.image_secondary_2,
              description: product.description,
            };
            return (
              <SearchProduct
                onClick={() => {
                  setValue('')
                  loadingNavigate("/product", query);
                }}
                setProgress={setProgress}
                product={product}
              />
            );
          })}
        </form>
      ) : null}
    </>
  );
}

export default SearchBar;
