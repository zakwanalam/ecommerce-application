import React, { useState } from "react";
import { REGEXP_ONLY_DIGITS, REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "../components/ui/input-otp";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { useLocation, useParams } from "react-router-dom";
import { toast, useToast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { useNavigate } from "react-router-dom";
import useLoadingNavigation from "@/LoadingNavigation/LoadingNavigation";

function Verify({setProgress}) {
  const location = useLocation()
  const params = new URLSearchParams(location.search) 
  const email = params.get('email')
  const password = params.get('password')
  const toast = useToast()
  const [otp,setValue] = useState('')
  const navigate = useNavigate()
  console.log(params.get('email'))

  const loadingNavigation =   useLoadingNavigation(setProgress)

  const handleSubmit = async ()=>{
      console.log(otp)
      const response = await axios.get('/api/verifyUser',{params:{
          email:email,
          verifyCode:otp,
          password:password
      }})

      if(response.data.success===true){
          toast.toast({
          variant:"success",
          title:"Successful Registration",
          description:"Your Account Has Been Successfully Verified"
        })
        setTimeout(()=>{
          loadingNavigation('/login')
        },2000)
      }
      else{
          toast.toast({
            variant:"destructive",
            title:"Invalid or Expired OTP",
            description:"Cannot Verify Your Account"
         })
      }
  }

  const handleResend = async()=>{
    const response  = await axios.get('/api/resend',{
      params:{email:email}
    })

    if(response.data.success===true){
          toast.toast({
            variant:"default",
            title:"Verification email sent",
        })
        console.log("verification email sent")``
    }
  }
  return (
    <div className="flex flex-col min-h-screen items-center bg-indigo-950 justify-center bg-slate-100">
      <div class="flex flex-col max-w-md max-h-full mx-auto text-center justify-center items-center bg-white px-4 sm:px-8 py-10 rounded-xl shadow">
        <header class="mb-8">
          <h1 class="text-2xl font-bold mb-1">Email OTP Verification</h1>
          <p class="text-[15px] text-slate-500">
            Enter the 4-digit verification code that was sent to your phone
            number.
          </p>
        </header>
        <div className="flex items-center justify-center min-[350px] w-full">
          <InputOTP maxLength={4} value={otp} onChange={(value)=>{setValue(value)}} pattern={REGEXP_ONLY_DIGITS}>
            <InputOTPGroup className="pt-1.5">
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
              <InputOTPSlot index={3} />
            </InputOTPGroup>
          </InputOTP>
        </div>
        <Button  onClick={handleSubmit} className="bg-indigo-500 m-5 mt-10">Verify Now</Button>
        <Toaster/>
        <p className="text-sm">
          If you haven't received code{" "}
          <strong onClick={handleResend} className="cursor-pointer text-indigo-500 hover:underline">
            Resend
          </strong>
        </p>
      </div>
    </div>
  );
}

export default Verify;
