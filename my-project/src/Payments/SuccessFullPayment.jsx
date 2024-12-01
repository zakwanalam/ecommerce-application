import React, { useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckCircle, CheckCircle2Icon, CheckCircleIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import axios from "axios";


function SuccessFullPayment({cart}) {


  return (
    <section class="bg-slate-100 flex justify-center items-center h-screen">
      <div class=" duration-700  transition ease-in-out hover:-translate-y-1 hover:scale-105 hover:bg-indigo-500 flex flex-col transition-ease-in items-center justify-center mx-6  max-sm:w-screen max-sm:px-0 w-fit px-36  max-sm:h-1/2 h-fit py-16 bg-primary shadow-xl rounded-xl">
        <CheckCircle2Icon
          size={60}
          
          className={"text-emerald-300 backdrop-blur-2xl mb-3 "}
        />{" "}
        <h1 class="text-2xl text-white font-bold ">Payment Succesful</h1>
       <a href="/home">
         <Button
           
           style={{ boxShadow: "3px 1px 40px rgba(110,231,183,0.25) " }}
           className={
             "bg-emerald-300 px-12 mt-10 text-md font-bold text-white hover:bg-green-100 hover:text-primary hover:shadow-primary shadow-green-500 backdrop-blur-md "
           }
         >
           Finish
         </Button>
       </a>
      </div>
    </section>
  );
}

export default SuccessFullPayment;
