import React, { Component, useEffect, useState } from "react";
import Hero from "./components/Hero";
import CarouselSlider from "./components/Carousel";
import Cart from "@/cart/cart";
import RecentProducts from "./components/RecentProducts";
import Navbar from "./components/navbar";
import ProductPage from "@/ProductPage/product";
import { Toaster } from "@/components/ui/toaster";
import { toast, useToast } from "@/components/ui/use-toast";
function Home(props) {


  return (
    <React.Fragment>
      <Hero
        addToCart={props.addToCart}
        productList={props.productList}
        cart={props.cart}
        no_cartItems={props.no_cartItems}
        loginStatus={props.loginLabel}
        setShowCart={props.setCartVisibility}
      />
      <RecentProducts
        productList={props.productList}
        addToCart={props.addToCart}
        sortType = {props.sortType}
        setSortType = {props.setSortType}
        category = {props.category}
        setCategory = {props.setCategory}
        setProgress={props.setProgress}
        toast={toast}
        isProductSelected={props.isProductSelected}
      />
      <div style={{ zIndex: "-20" }}>
        <CarouselSlider />
      </div>
      <Toaster className="fixed top-4 right-4 z-[9999]" />
    </React.Fragment>
  );
}

export default Home;
