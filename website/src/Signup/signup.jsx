import React, { useEffect, useState } from "react";
import axios from "axios";
import { useToast } from "../components/ui/use-toast.js";
import { Button } from "@/components/ui/button";
import { ToastAction } from "@/components/ui/toast";
import { Link, useNavigate } from "react-router-dom";
import { PasswordSchema, EmailSchema } from "@/schemas/SignupSchema.js";
import { z } from "zod";
import { Toaster } from "@/components/ui/toaster.jsx";

function Signup() {
  const [response, setResponse] = useState([]);
  const [error, setError] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    fullName: "",
    address: "",
    password: "",
  });

  const [confirmPassword, setConfirmPassword] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === "Enter") {
        document.getElementById("signup").click();
      } else {
        console.log("Not enter");
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress); // ✅ removeEventListener not add
    };
  }, []);

  return (
    <div className="flex justify-center bg-indigo-950 items-center min-h-screen p-4">
      <div className="w-full max-w-sm bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-6 text-center text-indigo-600">
          Signup
        </h2>
        <form>
          {/* Email */}
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
              required
            />
          </div>

          {/* Full Name */}
          <div className="mb-4">
            <label className="block text-gray-700 text-left" htmlFor="fullName">
              Full Name
            </label>
            <input
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              type="text"
              name="fullName"
              placeholder="Enter your full name"
              onChange={handleInputChange}
              required
            />
          </div>

          {/* Address */}
          <div className="mb-4">
            <label className="block text-gray-700 text-left" htmlFor="address">
              Address
            </label>
            <input
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              type="text"
              name="address"
              placeholder="Enter your address"
              onChange={handleInputChange}
              required
            />
          </div>

          {/* Password */}
          <div className="mb-4">
            <label className="block text-gray-700 text-left" htmlFor="password">
              Password
            </label>
            <input
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              type="password"
              name="password"
              placeholder="Enter your password"
              onChange={handleInputChange} // ✅ Fixed here
              required
            />
          </div>

          {/* Confirm Password */}
          <div className="mb-6">
            <label className="block text-gray-700 text-left" htmlFor="confirmPassword">
              Confirm Password
            </label>
            <input
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              type="password"
              name="confirmPassword"
              placeholder="Confirm your password"
              onChange={(e) => setConfirmPassword(e.target.value)} // ✅ Fixed here
              required
            />
          </div>

          {/* Submit Button */}
          <button
            className="w-full px-4 py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            type="button"
            id="signup"
            onClick={async () => {
              // Empty field validation
              if (
                formData.address === "" ||
                formData.email === "" ||
                formData.fullName === "" ||
                formData.password === ""
              ) {
                toast({
                  variant: "destructive",
                  title: "One or more Empty fields",
                  description: "Please fill out the required fields",
                });
                return;
              }

              // Password match check
              if (formData.password !== confirmPassword) {
                toast({
                  variant: "destructive",
                  title: "Invalid Data",
                  description: "Passwords do not match",
                });
                return;
              }

              // Email validation
              const emailRes = EmailSchema.safeParse({ email: formData.email });
              if (!emailRes.success) {
                toast({
                  variant: "destructive",
                  title: "Invalid Email",
                  description: "Please enter a valid email address",
                });
                return;
              }

              // Password schema validation
              const passRes = PasswordSchema.safeParse({ password: formData.password });
              if (!passRes.success) {
                toast({
                  variant: "destructive",
                  title: "Invalid Password",
                  description:
                    "Password must be at least 8 characters and include one special character or underscore",
                });
                return;
              }

              // Success
              toast({
                variant: "success",
                title: "Success",
                description: "Redirecting to verification...",
              });

              try {
                const response = await axios.get("/api/signup/", {
                  params: formData,
                });
                console.log(response.data);
                navigate(`/verify?email=${formData.email}`);
              } catch (error) {
                console.error("Error submitting form:", error);
                toast({
                  variant: "destructive",
                  title: "Server Error",
                  description: "Could not sign up. Try again later.",
                });
              }
            }}
          >
            Sign Up
          </button>
          <Toaster />
        </form>
      </div>
    </div>
  );
}

export default Signup;
