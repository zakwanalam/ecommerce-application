import React, { useEffect, useState } from "react";
import Product from "./Product";
import ProductPage from "@/ProductPage/product";
import { Navigate, useNavigate } from "react-router-dom";
import { useInView } from "react-intersection-observer";
import { FilterComboBox } from "./FilterComboBox";
import { SortComboBox } from "./SortComboBox";
import { useToast } from "@/components/ui/use-toast";
function RecentProducts(props) {
  console.log(props.category);

  const handleIntersection = (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate');
      } else {
        entry.target.classList.remove('animate');
      }
    });
  };
  const { ref: observerRef } = useInView({
    triggerOnce: true,
    threshold: 0.1,
    onChange: handleIntersection
  });
  // max-sm:flex-col max-sm:items-end sm:justify-center max-sm:gap-4 gap-8
  const [isCLicked, setClicked] = useState(false)
  const navigate = useNavigate()
  return (
    <>
      <div
        style={{ zIndex: "-1", }}
        className="flex bg-indigo-950 relative flex-col pt-14 items-center justify-center"
      >
        <h3 className="text-4xl text-white flex font-bold"> Our Products</h3>
        <div className="mt-5 w-20 h-1 bg-white"></div>
      </div>
      <div className="py-10 max-sm:pt-16 z-50 max-sm:py-6 pt-14 *:rounded-full  flex justify-center  gap-8 max-sm:gap-2  bg-indigo-950">
        <FilterComboBox category={props.category} setCategory={props.setCategory} />
        <SortComboBox sortType = {props.sortType} setSortType={props.setSortType} />
      </div>
      <div className={`pb-10 flex lg:px-20 bg-indigo-950  items-center justify-center flex-wrap gap-2 `}>
        {props.productList === null ? <Popup /> : props.productList
          .filter((product) => { return product.category.toLowerCase() === props.category || props.category === 'all' })
          .sort((a,b)=>
            {
              switch(props.sortType){
                case 'asc' : 
                return a.name.localeCompare(b.name)

                case 'desc':
                  return b.name.localeCompare(a.name)

                case 'low-price':
                  return a.stock[0].price - b.stock[0].price
              }
            })
          .map((product, i) => {
            {
              return (
                <>
                  <div ref={observerRef} style={{ zIndex: "0" }} id="recentProducts" className={` pt-6  ${i % 2 === 0 ? "lg:mx-20" : null}
 `}>
                    <Product
                      isProductSelected={props.isProductSelected}
                      addToCart={props.addToCart}
                      product={product}
                      setProgress={props.setProgress}
                      toast={props.toast}
                      key={i}
                      index={i}
                    />

                  </div>
                </>
              );
            }
          })}
      </div>

    </>
  );
}
export default RecentProducts;
