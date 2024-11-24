import { useState, useEffect } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

import {
  BrowserRouter,
  Link,
  Navigate,
  Route,
  Router,
  RouterProvider,
  Routes,
  createBrowserRouter,
  useNavigate,
} from "react-router-dom";
import { LoginForm } from "./login/Login";
import ForgetPassword from "./forgetPassword/ForgetPassword";
import Admin from "./Admin/adminLogin";
import React from "react";
import axios from "axios";
import Dashboard from "./Admin/dashboard";
import Orders from "./Admin/Orders";
import { Prodcut } from "./Admin/products";
import ProductEdit from "./Admin/productEdit";
import CustomerReviews from "./Admin/CustomerReviews";

// let productList = [
//   {
//     id:1,
//     image:"https://img.buzzfeed.com/buzzfeed-static/complex/images/dwmndbqhtsk71ob26a2s/banned-nike-air-ship-retro.jpg?downsize=700%3A%2A&output-quality=auto&output-format=auto",
//     name: "Air Jordan Max",
//     description:"Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ducimus, quos exercitationem. Aliquam, nulla mollitia aliquid maiores, cum suscipit quidem saepe, maxime tempora possimus autem labore harum. Quam suscipit distinctio debitis?",
//     original: "300",
//     status:'Active',
//     stock:{
//       small:{
//         quantity:200,
//         price:180,
//       },
//       medium:{
//         quantity:200,
//         price:180,
//       },
//       large:{
//         quantity:200,
//         price:180,
//       },
//     },
//     category:'Sports',
//     subCategory:'Sports',
//   },
//   {
//     id:2,
//     image:"https://hips.hearstapps.com/hmg-prod/images/hoka-zinal-13085-1643565794.jpg",
//     name: "Nike Air Max Black",
//     description:"Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ducimus, quos exercitationem. Aliquam, nulla mollitia aliquid maiores, cum suscipit quidem saepe, maxime tempora possimus autem labore harum. Quam suscipit distinctio debitis?",
//     original: "200",
//     size:'S',
//     stock:{
//       small:{
//         quantity:200,
//         price:180,
//       },
//       medium:{
//         quantity:200,
//         price:180,
//       },
//       large:{
//         quantity:200,
//         price:180,
//       },
//     },
//     status:'Active',
//     category:'Sports',
//     subCategory:'Sports',
//   },
//   {
//     id:3,
//     image:"https://cdn.thewirecutter.com/wp-content/media/2024/05/running-shoes-2048px-9718.jpg",
//     name: "Adidas Ultraboost Blue",
//     description:"Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ducimus, quos exercitationem. Aliquam, nulla mollitia aliquid maiores, cum suscipit quidem saepe, maxime tempora possimus autem labore harum. Quam suscipit distinctio debitis?",
//     size:'L',
//     original: "400",
//     stock:{
//       small:{
//         quantity:200,
//         price:180,
//       },
//       medium:{
//         quantity:200,
//         price:180,
//       },
//       large:{
//         quantity:200,
//         price:180,
//       },
//     },
//     status:'Active',
//     category:'Sports',
//     subCategory:'Sports',
//   },
//   {
//     id:4,
//     image:"https://i.ebayimg.com/images/g/KYEAAOSwB51jTHVr/s-l1600.jpg",
//     name: "Nike Air Max Black",
//     description:"Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ducimus, quos exercitationem. Aliquam, nulla mollitia aliquid maiores, cum suscipit quidem saepe, maxime tempora possimus autem labore harum. Quam suscipit distinctio debitis?",
//     original: "200",
//     size:'S',
//     stock:{
//       small:{
//         quantity:200,
//         price:180,
//       },
//       medium:{
//         quantity:200,
//         price:180,
//       },
//       large:{
//         quantity:200,
//         price:180,
//       },
//     },
//     status:'Active',
//     category:'Sports',
//     subCategory:'Sports',
//   },
//   {
//     id:5,
//     image:"https://cdn.thewirecutter.com/wp-content/media/2024/05/runningshoesforyou-2048px-2251.jpg?auto=webp&quality=75&width=1024",
//     name: "Adidas Ultraboost Blue",
//     description:"Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ducimus, quos exercitationem. Aliquam, nulla mollitia aliquid maiores, cum suscipit quidem saepe, maxime tempora possimus autem labore harum. Quam suscipit distinctio debitis?",
//     size:'L',
//     original: "400",
//     stock:{
//       small:{
//         quantity:200,
//         price:180,
//       },
//       medium:{
//         quantity:200,
//         price:180,
//       },
//       large:{
//         quantity:200,
//         price:180,
//       },
//     },
//     quantity: 1,
//     status:'Active',
//     subCategory:'Sports',
//   },
//   {
//     id:6,
//     image:"https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
//     name: "Adidas Ultraboost Blue",
//     description:"Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ducimus, quos exercitationem. Aliquam, nulla mollitia aliquid maiores, cum suscipit quidem saepe, maxime tempora possimus autem labore harum. Quam suscipit distinctio debitis?",
//     size:'L',
//     stock:{
//       small:{
//         quantity:200,
//         price:180,
//       },
//       medium:{
//         quantity:200,
//         price:180,
//       },
//       large:{
//         quantity:200,
//         price:180,
//       },
//     },
//     status:'Active',
//     subCategory:'Sports',

//   },
// ];

function App() {
  const [productList, setProductList] = useState([]);
  const nav = useNavigate();
  useEffect(() => {
    const getProduct = async () => {
      try {
        const response = await axios.get("/api/getProducts");
        // Convert stock property before setting state
        // const convertedProducts = response.data.product.map((product) => ({
        //   ...product,
        // }));

        setProductList(response.data.product);
      } catch (error) {
        console.error(error);
      }
    };
    const checkLoginStatus = async () => {
      try {
        const response = await axios.get("/api/verifyAdminSession");

        if (response.data.success === true) {
          setLogin(true);
        } else {
          setLogin(false);
          nav("/admin/login");
        }
      } catch (error) {
        console.log(error);
      }
    };
    checkLoginStatus();
    getProduct();
  }, []);
  const [loginStatus, setLogStatus] = useState(false);

  useEffect(() => console.log(loginStatus), [loginStatus]);

  const setLogin = (value) => {
    setLogStatus(value);
  };
  return (
    <React.Fragment>
      {loginStatus === true ? <Dashboard /> : ""}
      <Routes>
        <Route
          path="/admin/login"
          element={<LoginForm title="Hi Admin!" />}
        ></Route>
      </Routes>
      
      {loginStatus?
      <Routes>
        <Route path="/" element={<Navigate to="/orders"  />} />
        <Route path="/orders" element={<Orders />}></Route>
        <Route path="/customerReviews" element={<CustomerReviews />}></Route>
        <Route path="/product" element={<Prodcut productList={productList} />}>
          {" "}
        </Route>
        <Route path="/product/editProduct" element={<ProductEdit />}>
          {" "}
        </Route>
      </Routes>:null}
      {/* </BrowserRouter> */}
    </React.Fragment>
  );
}

export default App;
