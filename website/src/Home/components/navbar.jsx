import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Cart from "@/cart/cart";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import logo from "../../assets/logo.png";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DropdownMenuContent } from "@radix-ui/react-dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import useLoadingNavigation from "@/LoadingNavigation/LoadingNavigation";
import SearchBar from "./SearchBar";
function Navbar(props) {

  const [searchIconClicked,setSearchIconClicked] = useState(false)
  const [animate,setAnimate] = useState(false)

  const navigate = useNavigate();
  const loginClassName =
    props.loginStatus === "Login"
      ? "rounded-full pl-4 ml-6 pr-4 pt-2 pb-2 bg-indigo-500 text-white"
      : "rounded-full pl-4 pr-4 pt-2 pb-2 bg-red-500 text-white";

  const handleClick = async () => {
    if (props.loginStatus === "Login") {
      navigate("/login");
    }
    //LOGOUT
    else {
      const response = await axios.get("/api/logout");
      console.log(response.status);
      if (response.data.success === true) {
        console.log("hello");
        window.location.reload();
      }
    }
  };
  const [imageURI, setImageURI] = useState("");
  const [avatarStatus, setAvatarStatus] = useState(false);
  useEffect(() => {
    const profilePic = async () => {
      const res = await axios.get("/api/getProfilePic");
      setImageURI(res.data.profile_picture);
      console.log("mageeuri", res.data.profile_picture);
    };
    profilePic();
    console.log("mageeuri", imageURI);
  }, []);

  const uploadPhoto = async (e) => {
    setAvatarStatus(true);
    const file = e.target.files[0];
    console.log(file);
    const reader = new FileReader();
    reader.onload = async (e) => {
      const imageURI = e.target.result;
      const url = await (
        await axios.post("/api/uploadImage", { dataurl: imageURI })
      ).data.url;
      setImageURI(url);
      setAvatarStatus(false);
      const saveToDatabase = await axios.post("/api/uploadProfilePic", { url });
      if (saveToDatabase.data.success === true) {
      }
    };
    reader.readAsDataURL(file);
  };

  const EditProfile = ()=>{
    loadingNavigation('/editProfile')
  }

  const nav = useNavigate();
  const [showStatusBar, setShowStatusBar] = useState(true);
  const [showActivityBar, setShowActivityBar] = useState(false);
  const [showPanel, setShowPanel] = useState(false);
  const loadingNavigation = useLoadingNavigation(props.setProgress);
  return (
    <>
      <nav className=" text-white  w-11/12 min-[1000px]:w-9/12 px-3  rounded-full translate-x-[-50%] left-[50%]  mt-8 bg-indigo-900 z-20 shadow-xl  absolute border-gray-200 dark:bg-gray-900 dark:border-gray-700">
        <div className="max-w-screen-xl flex  items-center justify-between mx-auto my-0 ">
          <a
            onClick={() => {
              loadingNavigation("/home");
            }}
            className="flex items-center space-x-3 cursor-pointer md:pl-5 pl-2 rtl:space-x-reverse"
          >
            <img
              src={logo}
              className="h-6 pl-3 sm:h-8 w-auto object-contain"
              alt="Foot Finesse Logo"
            />
            <span className="max-lg:hidden italic self-center text-2xl font-bold whitespace-nowrap dark:text-white">
              Foot Finesse
            </span>
          </a>
      
          <ul className="flex flex-row cursor-pointer items-center justify-center md:pr-5 pr-2 font-medium p-4 max-sm:text-sm  ">
            <li>
              <a
                id="shop"
                onClick={(e) => {
                  if (location.pathname != "/home") {
                    loadingNavigation("/home",null,"recentProducts");
                  } else {
                    document.getElementById("recentProducts")?.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="  rounded  md:hover:bg-transparent      md:border-0 md:hover:text-orange-400 md:p-0 dark:text-white  dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
              >
                Shop
              </a>
            </li>
            <li
              className=" pl-10"
              id="cartIcon"
              hidden={props.loginStatus === "Login" ? true : false}
              onClick={() => {
                props.setShowCart();
              }}
            >
              <div className="h-5 w-5 rounded-full bg-red-500 absolute text-white text-sm ml-2 top-5">{`${props.cart.length}`}</div>
              <svg
                className="cursor-pointer"
                visibility={false}
                enable-background="new 0 0 50 50"
                height="23px"
                id="Layer_1"
                version="1.1"
                viewBox="0 0 50 50"
                width="23px"
                xml:space="preserve"
                xmlns="http://www.w3.org/2000/svg"
                xmlns:xlink="http://www.w3.org/1999/xlink"
              >
                <path
                  d="M8,14L4,49h42l-4-35H8z"
                  fill="none"
                  stroke="white"
                  stroke-linecap="round"
                  stroke-miterlimit="10"
                  stroke-width="3"
                />
                <rect fill="none" height="50" width="50" />
                <path
                  d="M34,19c0-1.241,0-6.759,0-8  c0-4.971-4.029-9-9-9s-9,4.029-9,9c0,1.241,0,6.759,0,8"
                  fill="none"
                  stroke="#000000"
                  stroke-linecap="round"
                  stroke-miterlimit="10"
                  stroke-width="2"
                />
                <circle cx="34" cy="19" r="2" />
                <circle cx="16" cy="19" r="2" />
              </svg>
            </li>
            <li className="md:px-10 max-md:px-8">
              <MagnifyingGlassIcon  onClick={()=>{setSearchIconClicked((prev)=>!prev) ;setAnimate(true)}} className="md:hidden w-6 h-6" />
              <SearchBar  searchIconClicked={searchIconClicked} animate={animate} setProgress={props.setProgress} productList={props.productList}/>
            </li>
            <li>
              <button
                hidden={props.loginStatus === "Login" ? false : true}
                onClick={handleClick}
                className={loginClassName}
                variant={"orange"}
              >
                {props.loginStatus}
              </button>
            </li>
            <li
              className=" flex items-center"
              hidden={props.loginStatus === "Login" ? true : false}
            >
              {/* <div hidden={props.loginStatus==='Login'? true:false}> */}
              <input
                onChange={uploadPhoto}
                id="dp"
                type="file"
                hidden={true}
                accept=".jpg,.png"
              ></input>
      
              <DropdownMenu className={"bg-white  "}>
                <DropdownMenuTrigger asChild>
                  <Avatar
                    className={`${
                      props.loginStatus === "Login" ? "hidden" : null
                    }`}
                  >
                    <AvatarImage
                      className="cursor-pointer"
                      src={
                        imageURI != null
                          ? imageURI
                          : "https://github.com/shadcn.png"
                      }
                      hidden={avatarStatus}
                      alt="@shadcn"
                    />
                    {/* <AvatarFallback>CN</AvatarFallback> */}
                    <Skeleton className="h-12 w-12 rounded-full" />
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-white flex flex-col  justify-end  shadow-lg mt-3 rounded-md transition-all animate-opacity-transition ">
                  <div className="p-2 pb-0 rounded-tl-md rounded-tr-md bg-slate-200 ">
                    <DropdownMenuItem
                      className={"bg-white text-black cursor-pointer"}
                      checked={showStatusBar}
                      onClick={() => {
                        document.getElementById("dp").click();
                      }}
                    >
                      Upload Image
                    </DropdownMenuItem>
                  </div>
                  <div className="p-2 pb-0 rounded-bl-md rounded-br-md  bg-slate-200 ">
                    <DropdownMenuItem
                      className={
                        "bg-white flex items-center justify-center text-black cursor-pointer"
                      }
                      checked={showStatusBar}
                      onClick={handleClick}
                    >
                      Logout
                    </DropdownMenuItem>
                  </div>
                  <div className="p-2 rounded-bl-md rounded-br-md  bg-slate-200 ">
                    <DropdownMenuItem
                      className={
                        "bg-white flex items-center justify-center text-black cursor-pointer"
                      }
                      checked={showStatusBar}
                      onClick={EditProfile}
                    >
                      Edit Profile
                    </DropdownMenuItem>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
              {/* </div> */}
              <h4 className="px-4 max-md:hidden max-md:pr-2 ">
                {props.userData && props.userData.fullName
                  ? props.userData.fullName.split(" ")[0]
                  : ""}
              </h4>
            </li>
          </ul>
        </div>
      
        {/* </div> */}
      </nav>
    </>

  );
}

export default Navbar;
