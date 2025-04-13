import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Rating } from "@mui/material";
import React from "react";

function Review({review}) {
    const date = new Date(review.date).toDateString()
    console.log('one',review);
  return (
    <>
      <div className="pb-14 text-white">
        <div className="flex-col justify-start items-start pl-9">
          <div className="flex">
            <Avatar>
              <AvatarImage
                src={review?.profile_picture || "https://github.com/c -shadcn.png"}
                alt="@shadcn"
              />
              <AvatarFallback
                className={"bg-slate-200 animate-pulse duration-600"}
              ></AvatarFallback>
            </Avatar>
            <div className="text-left flex-col justify-center">
              <h1 className="pl-4 font-semibold">{review?.fullName}</h1>
              <h1  className="text-sm text-gray-400  pr-7 pl-4">{date?date:Date(Date.now())}</h1>
            </div>
          </div>
          <div className="flex pt-4">
            <Rating
              readOnly
              value={review?.rating}
              onChange={(event, newValue) => {
                setValue(newValue);
              }}
            ></Rating>
          </div>
          <p className="text-left pt-4 pr-14">
            {review?.review_text}
          </p>
        </div>
      </div>
    </>
  );
}

export default Review;
