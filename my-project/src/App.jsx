import { useState, useEffect } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import Signup from "./Signup/signup";
import Verify from "./verify/verify";
import {
  BrowserRouter,
  Route,
  Router,
  RouterProvider,
  Routes,
  createBrowserRouter,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import { LoginForm } from "./login/Login";
import Home from "./Home/Home";
import ForgetPassword from "./forgetPassword/ForgetPassword";
import Cart from "./cart/cart";
import Admin from "./Admin/adminLogin";
import Product from "./ProductPage/product";
import ProductPage from "./ProductPage/product";
import Navbar from "./Home/components/navbar";
import React from "react";
import axios from "axios";
import Footer from "./Home/components/footer";
import Dashboard from "./Admin/dashboard";
import SuccessFullPayment from "./Payments/SuccessFullPayment";
import UnSuccessFullPayment from "./Payments/UnSuccessFullPayment";
import LoadingBar from 'react-top-loading-bar'
import DelayedRender from "./Home/components/DelayedRender";

// const productList = [
//   {
//     image:
//       "https://img.buzzfeed.com/buzzfeed-static/complex/images/dwmndbqhtsk71ob26a2s/banned-nike-air-ship-retro.jpg?downsize=700%3A%2A&output-quality=auto&output-format=auto",
//     name: "Air Jordan Max Model",
//     price: "200",
//     original: "300",
//     size:'M',
//     description:
//       "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ducimus, quos exercitationem. Aliquam, nulla mollitia aliquid maiores, cum suscipit quidem saepe, maxime tempora possimus autem labore harum. Quam suscipit distinctio debitis?",
//     quantity: 1,
//   },
//   {
//     image:
//       "https://hips.hearstapps.com/hmg-prod/images/hoka-zinal-13085-1643565794.jpg",
//     name: "Nike Air Max Black",
//     price: "150",
//     description:
//       "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ducimus, quos exercitationem. Aliquam, nulla mollitia aliquid maiores, cum suscipit quidem saepe, maxime tempora possimus autem labore harum. Quam suscipit distinctio debitis?",
//     original: "200",
//     size:'S',
//     quantity: 1,
//     imagesSecondary:{

//     }
//   },
//   {
//     image:"https://cdn.thewirecutter.com/wp-content/media/2024/05/running-shoes-2048px-9718.jpg",
//     name: "Adidas Ultraboost Blue",
//     description:
//       "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ducimus, quos exercitationem. Aliquam, nulla mollitia aliquid maiores, cum suscipit quidem saepe, maxime tempora possimus autem labore harum. Quam suscipit distinctio debitis?",
//     price: "180",
//     size:'L',
//     original: "400",
//     quantity: 1,
//   },
//   {
//     image:
//       "https://i.ebayimg.com/images/g/KYEAAOSwB51jTHVr/s-l1600.jpg",
//     name: "Nike Air Max Black",
//     price: "150",
//     description:
//       "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ducimus, quos exercitationem. Aliquam, nulla mollitia aliquid maiores, cum suscipit quidem saepe, maxime tempora possimus autem labore harum. Quam suscipit distinctio debitis?",
//     original: "200",
//     size:'S',
//     quantity: 1,
//     imagesSecondary:{

//     }
//   },
//   {
//     image:
//       "https://cdn.thewirecutter.com/wp-content/media/2024/05/runningshoesforyou-2048px-2251.jpg?auto=webp&quality=75&width=1024",
//     name: "Adidas Ultraboost Blue",
//     description:
//       "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ducimus, quos exercitationem. Aliquam, nulla mollitia aliquid maiores, cum suscipit quidem saepe, maxime tempora possimus autem labore harum. Quam suscipit distinctio debitis?",
//     price: "180",
//     size:'L',
//     original: "400",
//     quantity: 1,
//     imagesSecondary:{

//     }
//   },
//   {
//     image:
//       "https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
//     name: "Adidas Ultraboost Blue",
//     description:
//       "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ducimus, quos exercitationem. Aliquam, nulla mollitia aliquid maiores, cum suscipit quidem saepe, maxime tempora possimus autem labore harum. Quam suscipit distinctio debitis?",
//     price: "180",
//     size:'L',
//     original: "400",
//     quantity: 1,
//     imagesSecondary:{

//     }
//   },
// ];

function App() {
  const [loginLabel, setLoginLabel] = useState();
  const [appMode, setAppMode] = useState("user");
  const [productList, setProductList] = useState([]);
  let [cart, setCart] = useState([]);
  const location = useLocation();
  const [profile_picture, setProfilePicture] = useState("");
  const history = useNavigate();
  useEffect(() => {
    const checkSessionAndFetchCart = async () => {
      try {
        const sessionResponse = await axios.get("/api/verifySession");
        if (sessionResponse.status === 205) {
          setLoginLabel("Login");
        } else {
          setLoginLabel("Logout");
          if (sessionResponse.data.profile_picture) {
            console.log("response", sessionResponse.data.profile_picture);
            setProfilePicture(sessionResponse.data.profile_picture);
          }
          const cartResponse = await axios.get("/api/getCart");
          console.log("This is you cart", cartResponse.data);
          if (
            cartResponse.data.success === true &&
            cartResponse.data.cart != {}
          ) {
            setCart(cartResponse.data.cart);
          }
          await loadUserData();
        }
        console.log(sessionResponse.data);
        const query = new URLSearchParams(location.search);
        const checkout = query.get("checkout");
        console.log(checkout);

        if (checkout === "true") {
          setCart((prevCart) => {
            saveCartToDatabase([]);
            return [];
          });
          query.set("checkout", "false");
          history({ search: query.toString() }, { replace: true });
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    const getProduct = async () => {
      try {
        const response = await axios.get("/api/getProducts");
        // Convert stock property before setting state
        const convertedProducts = response.data.product.map((product) => ({
          ...product,
          stock: JSON.parse(product.stock),
        }));

        setProductList(convertedProducts);
      } catch (error) {
        console.error(error);
      }
    };
    setAppMode("user");
    getProduct();
    checkSessionAndFetchCart();
  }, []); // Empty dependency array ensures this runs only once

  const addToCart = async (index) => {
    const { image_secondary_1, image_secondary_2, ...productWithoutImage } =
      productList[index];

    setCart((prevCart) => {
      const myCart = [...prevCart];
      myCart.push({
        ...productWithoutImage,
        quantity: 1,
      });
      // Save the updated cart to the database
      saveCartToDatabase(myCart);
      return myCart;
    });
  };

  const saveCartToDatabase = async (cart) => {
    //save to database
    console.log("this cart", cart);
    const response = await axios.post("/api/addToCart", cart, {
      headers: { "Content-Type": "application/json" },
    });
    console.log("Success", response.data.cart);
  };
  const [userData, setUserData] = useState([]);

  const loadUserData = async () => {
    const response = await axios.get("/api/loadUserData");
    if (response.data.success === true) {
      setUserData(response.data);
      return;
    }
    console.log("Cannot Fetch userData ");
  };

  const removeFromCart = async (index) => {
    setCart((prevCart) => {
      // Create a copy of the previous cart state
      let myCart = [...prevCart];
      // Remove the item at the specified index
      myCart.splice(index, 1);

      // Log the updated cart to check its state
      console.log("Updated cart:", myCart);

      // Save the updated cart to the database
      saveCartToDatabase(myCart);

      // Return the updated cart to update the state
      return myCart;
    });
  };

  const [showCart, setShowCart] = useState(false);

  const setCartVisibility = () => {
    showCart === true ? setShowCart(false) : setShowCart(true);
  };

  const setProductQuantity = (index, quantity) => {
    setCart((prevCart) => {
      let newCart = [...prevCart];
      newCart[index] = { ...newCart[index], quantity };
      console.log("Updated cart:", newCart);

      saveCartToDatabase(newCart);

      return newCart;
    });
  };
  const isHome = location.pathname === "/home" || location.pathname=== "/product";
  const [animation, setAnimation] = useState("");
  const productSelected = true;
  useEffect(() => {
    if (showCart === true) {
      setAnimation("animate-slide-in");
      document.body.style.overflow = "hidden";
    } else {
      setAnimation("animate-slide-out");
      document.body.style.overflow = "scroll";
    }
  });

  const [bool, setBool] = useState(false);
  const isProductSelected = () => {
    setBool((prevValue) => !prevValue);
    console.log(bool);
  };

  const appModeSet = (value) => {
    setAppMode(value);
  };
  const [progress, setProgress] = useState(0)

  return (
    <React.Fragment>
      <LoadingBar
        color='#f11946'
        progress={progress}
        height={2.2}
        transitionTime={100}
        onLoaderFinished={() => setProgress(0)}
      />
      {isHome&& (
        <>
          {loginLabel === "Logout" && appMode === "user" ? (
            <Cart
              setProductQuantity={setProductQuantity}
              removeFromCart={removeFromCart}
              cart={cart}
              setShowCart={setCartVisibility}
              animation={animation}
            />
          ) : null}
          <Navbar
            cart={cart}
            loginStatus={loginLabel}
            setShowCart={setCartVisibility}
            userData={userData}
            setProgress={setProgress}
            profile_picture={profile_picture ? profile_picture : ""}
          />
        </>
      )}
      <Routes>
        <Route path="/signup" element={<Signup />}></Route>
        <Route
          path="/home"
          element={
            <Home
              addToCart={addToCart}
              productList={productList}
              cart={cart}
              loginStatus={loginLabel}
              setShowCart={setCartVisibility}
              isProductSelected={isProductSelected}
              setProgress={setProgress}
            />
          }
        ></Route>
        <Route path="/verify" element={<Verify />}></Route>
        <Route path="/login" element={<LoginForm title="Login" />}></Route>
        <Route path="/forgetPassword" element={<ForgetPassword />}></Route>
        <Route path="/cart" element={<Cart />}></Route>
        <Route path="/product"  element={<ProductPage setProgress = {setProgress}   loginStatus={loginLabel}  />} ></Route>}
      </Routes>
      <Routes>
        <Route path="/paymentSuccess" element={<SuccessFullPayment />}></Route>
        <Route path="/paymentFail" element={<UnSuccessFullPayment />}></Route>
      </Routes>
      {isHome && <>{appMode === "user" ? <Footer /> : null}</>}
      {/* </BrowserRouter> */}
    </React.Fragment>
  );
}

export default App;
