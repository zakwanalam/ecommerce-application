// Importing Button component from ui/button
import { Button } from "@/components/ui/button";

// Importing Card-related components from ui/card
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination";

import { Separator } from "@/components/ui/separator";
import { Toaster } from "@/components/ui/toaster";
// import { toast } from "@/components/ui/use-toast";

import {
  Copy,
  Truck,
  MoreVertical,
  CreditCard,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import React from "react";
import { titleCase } from "title-case";
import "../../src/App.css"; // Import your custom styles after

function OrderCard({ setCardCount, order, cardCount, orderLength }) {
  console.log("order object", order);

  const handleCopy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Copied To Clipboard");
    } catch (e) {
      console.log(e);
    }
  };

  var a = "";
  return (
    <Card className="overflow-hidden mb-4" x-chunk="dashboard-05-chunk-4">
      <CardHeader className="flex flex-row items-start bg-muted/50">
        <div className="grid gap-0.5">
          <CardTitle className="group flex items-center gap-2 text-lg ">
            {order?.id.slice(0, 20)}...
            <Button
              size="icon"
              variant="outline"
              onClick={() => handleCopy(order?.id)}
              className="h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
            >
              <Copy id="copy" className="h-3 w-3 " />
              <span className="sr-only">Copy Order ID</span>
            </Button>
          </CardTitle>
          <CardDescription>order.created</CardDescription>
        </div>
        <ToastContainer position="top-center" autoClose={1000} />
        <div className="ml-auto flex items-center gap-1">
          <Button size="sm" variant="outline" className="h-8 gap-1">
            <Truck className="h-3.5 w-3.5" />
            <span className="lg:sr-only xl:not-sr-only xl:whitespace-nowrap">
              Track Order
            </span>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="icon" variant="outline" className="h-8 w-8">
                <MoreVertical className="h-3.5 w-3.5" />
                <span className="sr-only">More</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Edit</DropdownMenuItem>
              <DropdownMenuItem>Export</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Trash</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="p-6 text-sm">
        <div className="grid gap-3">
          <div className="font-semibold">Order Details</div>
          <ul className="grid gap-3">
            {order?.products?.map((product, index) => {
              return (
                <li className="flex items-center justify-between">
                  <span className="text-muted-foreground">
                    <span> {product?.product_name}</span>
                    <span className="px-2">x{product?.quantity?product?.quantity:1}</span>
                  </span>
                  <span>{product?.subtotal?product?.subtotal:product?.unit_price}</span>
                </li>
              );
            })}
          </ul>
          <Separator className="my-2" />
          <ul className="grid gap-3">
            <li className="flex items-center justify-between font-semibold">
              <span className="text-muted-foreground">Total</span>
              <span>${order?.total_price}</span>
            </li>
          </ul>
        </div>
        <Separator className="my-4" />
        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-3">
            <div className="font-semibold">Shipping Information</div>
            <address className="grid gap-0.5 not-italic text-muted-foreground">
              <span>{order?.customer_details.name}</span>
              <span>{order?.customer_details.address.line1}</span>
              <span>{order?.customer_details.address?.line2}</span>
              <span>{`${order?.customer_details.address.city} , ${order?.customer_details.address.country}`}</span>
            </address>
          </div>
          <div className="grid auto-rows-max gap-3">
            <div className="font-semibold">Billing Information</div>
            <div className="text-muted-foreground">
              Same as shipping address
            </div>
          </div>
        </div>
        <Separator className="my-4" />
        <div className="grid gap-3">
          <div className="font-semibold">Customer Information</div>
          <dl className="grid gap-3">
            <div className="flex items-center justify-between">
              <dt className="text-muted-foreground">Customer</dt>
              <dd>{order?.customer_details.name}</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-muted-foreground">Email</dt>
              <dd>
                <a href="mailto:">{order?.customer_details.email}</a>
              </dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-muted-foreground">Phone</dt>
              <dd>
                <a href="tel:">{order?.customer_details.phone}</a>
              </dd>
            </div>
          </dl>
        </div>
        <Separator className="my-4" />
        <div className="grid gap-3">
          <div className="font-semibold">Payment Information</div>
          <dl className="grid gap-3">
            <div className="flex items-center justify-between">
              <dt className="flex items-center gap-1 text-muted-foreground">
                <CreditCard className="h-4 w-4" />
                {order.card?.toUpperCase()}
              </dt>
              <dd>**** **** **** {order?.last4}</dd>
            </div>
          </dl>
        </div>
      </CardContent>
      <CardFooter className="flex flex-row items-center border-t bg-muted/50 px-6 py-3">
        <div className="text-xs text-muted-foreground">
          Updated <time dateTime="2023-11-23">November 23, 2023</time>
        </div>
        <Pagination className="ml-auto mr-0 w-auto">
          <PaginationContent>
            <PaginationItem
              onClick={() => {
                console.log("next count");
                if (cardCount === 0) {
                  setCardCount(orderLength-1);
                } else {
                  setCardCount(cardCount - 1);
                }
              }}
            >
              <Button size="icon" variant="outline" className="h-6 w-6">
                <ChevronLeft className="h-3.5 w-3.5" />
                <span className="sr-only">Previous Order</span>
              </Button>
            </PaginationItem>
            <PaginationItem
              onClick={() => {
                console.log("next count");
                if (cardCount === orderLength - 1) {
                  setCardCount(0);
                } else {
                  setCardCount(cardCount + 1);
                }
              }}
            >
              <Button size="icon" variant="outline" className="h-6 w-6">
                <ChevronRight className="h-3.5 w-3.5" />
                <span className="sr-only">Next Order</span>
              </Button>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </CardFooter>
    </Card>
  );
}

export default OrderCard;
