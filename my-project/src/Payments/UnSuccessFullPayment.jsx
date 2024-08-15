import { Button } from "@/components/ui/button";
import { CancelRounded } from "@mui/icons-material";
import { CheckCircle2Icon, CrossIcon } from "lucide-react";
import React from "react";

function UnSuccessFullPayment() {
  return (
    <section class="bg-slate-100 flex justify-center items-center h-screen">
      <div class=" duration-700  transition ease-in-out hover:-translate-y-1 hover:scale-105 bg-destructive flex flex-col transition-ease-in items-center justify-center mx-6  max-sm:w-screen max-sm:px-0 w-fit px-32  max-sm:h-1/2 h-fit py-16 shadow-xl rounded-xl">
      <svg className="w-20 pb-3" id="Icons" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><defs><style>.cls-1</style ></defs><path fill="white" class="cls-1" d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm4.707,14.293a1,1,0,1,1-1.414,1.414L12,13.414,8.707,16.707a1,1,0,1,1-1.414-1.414L10.586,12,7.293,8.707A1,1,0,1,1,8.707,7.293L12,10.586l3.293-3.293a1,1,0,1,1,1.414,1.414L13.414,12Z"/></svg>
        <h1 class="text-2xl mt-2 text-white font-bold ">Payment Unsuccessful</h1>
        <a href="/home">
          <Button
            style={{ boxShadow: "3px 1px 40px rgba(110,231,183,0.25) " }}
            className={
              "bg-white  mt-10  text-md font-bold text-destructive hover:bg-slate-100  shadow-green-500 backdrop-blur-md "
            }
          >
            Back To Home
          </Button>
        </a>
      </div>
    </section>
  );
}

export default UnSuccessFullPayment;
