import React, { useEffect, useState } from "react";
import axios from "axios";
import { useToast } from "../components/ui/use-toast.js"
import { Button } from "@/components/ui/button"
import { ToastAction } from "@/components/ui/toast"
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import { PasswordSchema,EmailSchema } from "@/schemas/SignupSchema.js";
import { z } from "zod";
import { Toaster } from "@/components/ui/toaster.jsx";

function Signup() {
  const [response, setResponse] = useState([]);
  const [error, setError] = useState(false);
  const {toast} = useToast()
  const [formData, setFormData] = useState({
    email: "",
    fullName: "",
    address: "",
    password: "",
  });

  const [confirmPassword,setConfirmPassword] = useState('')
  const navigate = useNavigate()
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get("/api/", { params: formData });
      console.log(response.data);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };
  return (
    <div className="flex justify-center bg-indigo-950 items-center min-h-screen p-4 ">
      <div className="w-full max-w-sm bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-6 text-center text-indigo-600">
          Signup
        </h2>
        <form>
          <div className="mb-4">
            <label className="block text-gray-700 text-left" htmlFor="email">
              Email
            </label>
            <input
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              type="email"
              name="email"
              placeholder="Enter your email"
              onChange={handleInputChange}
              required={true}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-left" htmlFor="fullname">
              Full Name
            </label>
            <input
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              type="text"
              name="fullName"
              required={true}
              placeholder="Enter your full name"
              onChange={handleInputChange}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-left" htmlFor="address">
              Address
            </label>
            <input
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              type="text"
              id="address"
              name="address"
              required={true}
              onChange={handleInputChange}
              placeholder="Enter your address"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-left" htmlFor="password">
              Password
            </label>
            <input
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              type="password"
              required={true}
              onChange={(e)=>{setConfirmPassword(e.target.value)}}
              placeholder="Enter your password"
            />
          </div>
          <div className="mb-6">
            <label
              className="block text-gray-700 text-left"
              htmlFor="confirm-password"
            >
              Confirm Password
            </label>
            <input
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              type="password"
              name="password"
              placeholder="Confirm your password"
              required={true}
              onChange={handleInputChange}
            />
          </div>
          <button
            className="w-full px-4 py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            type="button"
            onClick={async () => { 
              
                //VALIDATION CHECKS
              if(formData.address==="" ||formData.email==="" || formData.fullName==="" || formData.password===""){
                toast({
                  variant:'destructive',
                  title:"One or more Empty fields",
                  description:"Please fill out the required fields"
                })
                return
              }
              if(formData.password!=confirmPassword){
                  toast({
                    variant:'destructive',
                    title:"Invalid Data",
                    description:"Password do not match"
                })
                return
              }
              const emailRes = EmailSchema.safeParse({email:formData.email})
              console.log(emailRes.success)
              if(!emailRes.success){
                toast({
                    variant:'destructive',
                    title:"Invalid Data",
                    description:"Invalid Email"
                })
                return
              }
              const passRes =  PasswordSchema.safeParse({password:formData.password})
              if(!passRes.success){
                  toast({
                      variant:'destructive',
                      title:"Invalid Data",
                      description:"Password must be atleast 8 characters and contain atleast one special character or underscore"
                  })
                  return
              }

              //SUCCESSFUL VALIDATION
              toast({
                variant:"success",
                title:"Success",
              })
              const response = await axios.get("/api/signup/", {
                params: formData,
              });
              console.log(response.data);
              console.log(formData);
              navigate(`/verify?email=${formData.email}`)
            }}
          >
            Sign Up
          </button>
          <Toaster/>
        </form>
      </div>
    </div>
  );
}

export default Signup;
// const handleSubmit = async (e) => {
//   e.preventDefault();
//   try {
//       const response = await axios.post('/api/addOrUpdateUser', formData);
//       console.log(response.data);
//   } catch (error) {
//       console.error('Error submitting form:', error);
//   }
// };
