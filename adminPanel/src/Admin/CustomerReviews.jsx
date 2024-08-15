import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  File,
  Home,
  LineChart,
  ListFilter,
  MoreHorizontal,
  Package,
  Package2,
  PanelLeft,
  PlusCircle,
  Search,
  Settings,
  ShoppingCart,
  Users2,
  Image,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import axios from "axios";
import ProductEdit from "./productEdit";
import exportJSONToCSV from "@/csvExport";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
function CustomerReviews() {
  const [reviews, setReviews] = useState([]);
  useEffect(() => {
    const customerReviews = async () => {
      const response = await axios.get("/api/getReviews");
      if (response.data.success === true) {
        setReviews(response.data.reviews);
      }
    };
    customerReviews();
  }, []);
  const deleteReview = async(review)=>{
    console.log(review);
    await axios.delete('api/deleteReview',{params:{
      id:review.review_id
    }})
    
  }

  const[imageHidden,setImageHidden] = useState(true)
  return (
    <div className="md:pl-14">
      <div className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
        <Tabs defaultValue="all">
          <div className="flex items-center">
          
            <div className="ml-auto flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="h-7 gap-1">
                    <ListFilter className="h-3.5 w-3.5" />
                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                      Filter
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuCheckboxItem checked>
                    Active
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem>Draft</DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem>Archived</DropdownMenuCheckboxItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button size="sm" variant="outline" className="h-7 gap-1">
                <File className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                  Export
                </span>
              </Button>
              <Button size="sm" className="h-7 gap-1">
                <PlusCircle className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                  Add Product
                </span>
              </Button>
            </div>
          </div>
          <TabsContent value="all">
            <Card x-chunk="dashboard-06-chunk-0">
              <CardHeader>
                <CardTitle>Reviews</CardTitle>
                <CardDescription>
                  See your customer feedback on your products 
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="hidden w-[100px] sm:table-cell">
                        <span className="sr-only">Image</span>
                      </TableHead>
                      <TableHead className="text-center">
                        Product Name
                      </TableHead>
                      <TableHead className="text-center">
                        Customer Avatar
                      </TableHead>
                      <TableHead className="text-center">
                        Customer Name
                      </TableHead>
                      <TableHead className="text-center">Feedback</TableHead>
                      <TableHead className="text-center hidden md:table-cell">
                        Rating
                      </TableHead>
                      <TableHead className="text-center hidden md:table-cell">
                        Date
                      </TableHead>
                      <TableHead className="text-center hidden md:table-cell"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {reviews.map((review, key) => {
                      return (
                        <TableRow>
                         <TableCell className="hidden relative sm:table-cell">
                            <img
                              alt="Product image"
                              hidden={imageHidden}
                              onLoad={() => {
                                setImageHidden(false);
                              }}
                              className=" aspect-square absolute h-16 w-16 rounded-md object-cover "
                              src={review.image_main}
                            />
                           
                            <div
                              className={` w-16 h-16 aspect-square rounded-md   bg-slate-100 ${
                                imageHidden === true ? "animate-pulse" : ""
                              } `}
                            ></div>
                            </TableCell>
                          <TableCell className="font-medium">
                            {review?.name}
                          </TableCell>
                          <TableCell>
                            <Avatar className={"translate-x-[-50%] left-[50%]"}>
                              <AvatarImage
                                src={review.profile_picture}
                              ></AvatarImage>
                              <AvatarFallback></AvatarFallback>
                            </Avatar>
                          </TableCell>
                          <TableCell>{review?.fullName}</TableCell>
                          <TableCell className="py-4 font-semibold max-w-64 text-sm hidden md:table-cell">
                            {review.review_text}
                          </TableCell>
                          <TableCell className="hidden font-semibold md:table-cell">
                            {review?.rating}
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            {new Date(review.date).toDateString()}
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger  asChild>
                                <Button
                                  aria-haspopup="true"
                                  size="icon"
                                  variant="ghost"
                                >
                                  <MoreHorizontal className="h-4 w-4" />
                                  <span className="sr-only">Toggle menu</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem  onClick={()=>{deleteReview(review)}}>Delete</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
              <CardFooter>
                <div className="text-xs text-muted-foreground">
                  Showing <strong>1-10</strong> of <strong>32</strong> products
                </div>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default CustomerReviews;
