import useLoadingNavigation from "@/LoadingNavigation/LoadingNavigation";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { titleCase } from "title-case";
function EditProfile({setProgress}) {
  const [userData, setUserData] = useState({email:'',
    firstName:'' ,
    lastName: '',
    address:'',
    profile_picture:''});
  const [imageURI, setImageURI] = useState("");
  const [skeletonHide, setSkeletonHide] = useState(imageURI !=''?false:true);
  
  useEffect(() => {
    const getUser = async () => {
      const response = await axios.get("/api/loadUserData");
      const picture = await axios.get("/api/getProfilePic");
      setUserData({
        email: response.data.email,
        firstName: response.data.fullName.split(" ")[0],
        lastName: response.data.fullName.split(" ")[1],
        address: response.data.address,
      });
      setImageURI((await picture).data.profile_picture)
    };
    getUser();
  }, []);


  const uploadImage = async (e) => {
    const file = e.target.files[0];
    console.log(file);
    const fileReader = new FileReader();
    if (file) {
      setSkeletonHide(false);
      setImageURI('')
    }
    fileReader.onload = async (e) => {
      const imageuri = e.target.result;
      const url = await (
        await axios.post("/api/uploadImage", { dataurl: imageuri })
      ).data.url;
      setUserData({...userData,profile_picture:url})
      console.log(imageURI);
      setSkeletonHide(true);
    };
    fileReader.readAsDataURL(file);
  };
  const loadingNavigation =   useLoadingNavigation(setProgress)

  const handleSaveChanges = async()=>{
    const response = axios.post('/api/saveUser')
    
    loadingNavigation('/home')
    
  }
  return (
    <div class="bg-indigo-950 conta  absolute flex items-center  justify-center w-screen h-screen font-sans">
      <div class="container w-[1400px] bg-orange-400   rounded-lg  shadow-lg">
        <div class="flex max-sm:flex-col justify-center py-20 max-sm:pt-20 max-sm:items-center gap-4 p-10  items-start">
          <div class="flex flex-col  max-sm:items-center placeholder:px-5 justify-center items-start mb-5">
            <div
              onClick={() => {
                const imageInput = document
                  .getElementById("uploadImage")
                  .click();
              }}
              className="relative  items-center h-44 w-40"
            >
              <img
                src={userData.profile_picture!=null?userData.profile_picture:'https://github.com/shadcn.png'}
                hidden={!skeletonHide}
                class="rounded-full aspect-square w-40 object-cover absolute hover:cursor-pointer  mb-5 "
              />
              <div
                hidden={skeletonHide}
                class="rounded-full aspect-square w-40 object-cover absolute hover:cursor-pointer bg-white/40 animate-pulse  mb-5 "
              ></div>
              <div class="rounded-full flex items-center justify-center aspect-square w-40 object-cover opacity-0 bg-black/40 transition-opacity hover:opacity-100  absolute hover:cursor-pointer  mb-5 ">
                <input
                  onChange={uploadImage}
                  id="uploadImage"
                  hidden
                  accept=".jpg , .png"
                  type="file"
                />
                <h1 className=" text-gray-100 font-normal text-xl text-center">
                  {" "}
                  Upload Profile Picture
                </h1>
              </div>
            </div>
            <div>
              <p class="font-semibold text-left max-sm:text-center text-gray-700">
                {titleCase(userData?.firstName + " " + userData?.lastName)}
              </p>
              <p  class="text-gray-600 max-sm:text-center">
                {userData?.email}
              </p>
            </div>
          </div>
          <div class="flex px-5 flex-col w-screen text-left gap-6">
            <h2 class="text-3xl font-bold text-gray-800 mb-6">
              Account Settings
            </h2>
            <div>
              <label for="email" class="block text-gray-700 font-bold mb-2">
                Email address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                disabled
                value={userData?.email}
                class="shadow bg-slate-200 appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label for="firstName" class="block text-gray-700 font-bold mb-2">
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={titleCase(userData?.firstName)}
                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Enter your first name"
              />
            </div>

            <div>
              <label for="website" class="block text-gray-700 font-bold mb-2">
                Last Name
              </label>
              <input
                type="url"
                id="website"
                name="website"
                value={titleCase(userData?.lastName)}
                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Enter your website URL"
              />
            </div>

            <div>
              <label for="facebook" class="block text-gray-700 font-bold mb-2">
                Address
              </label>
              <input
                type="url"
                id="facebook"
                name="facebook"
                value={titleCase(userData?.address)}
                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Enter your complete address"
              />
            </div>

            <div class="mt-6">
              <button onClick={handleSaveChanges} class="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditProfile;
