import React, { useEffect, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Copy,
  CreditCard,
  File,
  Home,
  LineChart,
  ListFilter,
  MoreVertical,
  Package,
  Package2,
  PanelLeft,
  Search,
  Settings,
  ShoppingCart,
  Truck,
  Users2,
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
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
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
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import OrderRow from "./OrderRow";
import axios from "axios";
import OrderCard from "./OrderCard";
import { Skeleton } from "@/components/ui/skeleton";
import OrderTableSkeleton from "./OrderTableSkeleton";
function Orders() {

  const [weekAmount,setWeekAmount] = useState(0);
  const [monthAmount,setMonthAmount] = useState(0);

  useEffect(()=>{
    const weekAmount  = ()=>{
      setWeekAmount(0)
      orders.map((element)=>{
        if(isLessThanAWeek(element.created)){
          setWeekAmount(prev=>parseFloat(prev+=parseFloat(element.amount_total)).toFixed(2))
        }
      })
    }
    const monthAmount = ()=>{
      setMonthAmount(0)
      orders.map((element)=>{
        if(isDateLessThanAYear(element.created)){
          setMonthAmount(prev=>parseFloat(prev+=parseFloat(element.amount_total)).toFixed(2))
        }
      })
    }
    weekAmount()
    monthAmount()
  })
  

  const [orders, setOrders] = useState([]);
  const [cardCount, setCardCount] = useState(0);
  const [hideSkeleton, setHideSkeleton] = useState(false);
  useEffect(() => {
    const getOrders = async () => {
      const allOrders = await axios.get("/api/getOrders");
      setOrders(allOrders.data.sessions);
    };
    getOrders();
    console.log(orders);
  }, []);
  useEffect(() => {
    console.log(cardCount);
  }, [cardCount]);

  const isDateLessThanAMonth = (date) => {
    const then = new Date(date);
    const now = new Date();

    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(now.getMonth() - 1);
    return then > oneMonthAgo;
  };
  
  const isDateLessThanAYear = (date) => {
    const then = new Date(date);
    const oneYearAgo = new Date(Date.now());
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

    return then > oneYearAgo;
  };

  const isLessThanAWeek = (date) => {
    const then = new Date(date);
    const now = new Date();

    const oneWeekInMs = 7 * 24 * 60 * 60 * 1000;
    const timeDifference = now.getTime() - then.getTime();
    return timeDifference <= oneWeekInMs;
  };

  const isLessThan3Days = (date) => {
    const then = new Date(date);
    const now = new Date();
    const oneWeekInMs = 3 * 24 * 60 * 60 * 1000;
    const timeDifference = now.getTime() - then.getTime();
    return timeDifference <= oneWeekInMs;
  };

  return (
    <div className=" md:pl-14">
      <div className="grid flex-1 absolute items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
        <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
            <Card className="sm:col-span-2 bg-primary" x-chunk="dashboard-05-chunk-0">
              <CardHeader className="pb-3">
                <CardTitle className={'text-3xl text-white font-semibold pb-3'}>Your Orders</CardTitle>
                <CardDescription className="max-w-lg text-white text-balance leading-relaxed">
                Introducing Dynamic Orders Dashboard for Seamless
                Management and Insightful Analysis.Integrating advanced data visualization and 
                automation.
                </CardDescription>
              </CardHeader>
             
            </Card>
            <Card x-chunk="dashboard-05-chunk-1">
              <CardHeader className="pb-2">
                <CardDescription>This Week</CardDescription>
                <CardTitle className="text-4xl">${weekAmount}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xs text-muted-foreground">
                  +25% from last week
                </div>
              </CardContent>
              <CardFooter>
                <Progress value={25} aria-label="25% increase" />
              </CardFooter>
            </Card>
            <Card x-chunk="dashboard-05-chunk-2">
              <CardHeader className="pb-2">
                <CardDescription>This Month</CardDescription>
                <CardTitle className="text-4xl">${monthAmount}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xs text-muted-foreground">
                  +10% from last month
                </div>
              </CardContent>
              <CardFooter>
                <Progress value={12} aria-label="12% increase" />
              </CardFooter>
            </Card>
          </div>
          <Tabs defaultValue="week">
            <div className="flex items-center">
              <TabsList>
                <TabsTrigger value="3days">3 Days</TabsTrigger>
                <TabsTrigger value="week">Week</TabsTrigger>
                <TabsTrigger value="month">Month</TabsTrigger>
                <TabsTrigger value="year">Year</TabsTrigger>
              </TabsList>
              <div className="ml-auto flex items-center gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-7 gap-1 text-sm"
                    >
                      <ListFilter className="h-3.5 w-3.5" />
                      <span className="sr-only sm:not-sr-only">Filter</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuCheckboxItem checked>
                      Fulfilled
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem>
                      Declined
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem>
                      Refunded
                    </DropdownMenuCheckboxItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-7 gap-1 text-sm"
                >
                  <File className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only">Export</span>
                </Button>
              </div>
            </div>
            <TabsContent value="3days">
              <Card x-chunk="dashboard-05-chunk-3">
                <CardHeader className="px-7">
                  <CardTitle>Orders</CardTitle>
                  <CardDescription>
                    Recent orders from your store.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className={"text-center"}>
                          Customer
                        </TableHead>
                        <TableHead className="text-center hidden sm:table-cell">
                          Type
                        </TableHead>
                        <TableHead className=" text-center hidden sm:table-cell">
                          Status
                        </TableHead>
                        <TableHead className="text-center hidden md:table-cell">
                          Date
                        </TableHead>
                        <TableHead className="text-center text-right">
                          Amount
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orders.map((session, i) => {
                        if (isLessThan3Days(session.created)) {
                          return (
                            <>
                              <OrderRow
                                onClick={() => {
                                  setCardCount(i);
                                }}
                                order={session}
                              />
                            </>
                          );
                        }
                      })}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="week">
              <Card x-chunk="dashboard-05-chunk-3">
                <CardHeader className="px-7">
                  <CardTitle>Orders</CardTitle>
                  <CardDescription>
                    Recent orders from your store.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        {orders.length > 0 ? (
                          <>
                            <TableHead className={"text-center"}>
                              Customer
                            </TableHead>
                            <TableHead className="text-center hidden sm:table-cell">
                              Type
                            </TableHead>
                            <TableHead className=" text-center hidden sm:table-cell">
                              Status
                            </TableHead>
                            <TableHead className="text-center hidden md:table-cell">
                              Date
                            </TableHead>
                            <TableHead className="text-center text-right">
                              Amount
                            </TableHead>
                          </>
                        ) : (
                          <TableHead className={"text-center"}>
                            Loading...
                          </TableHead>
                        )}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orders.length > 0 ? (
                        orders.map((session, i) => {
                          if (isLessThanAWeek(session.created)) {
                            return (
                              <>
                                <OrderRow
                                  className={"absolute"}
                                  onClick={() => {
                                    setCardCount(i);
                                  }}
                                  order={session}
                                />
                              </>
                            )                        ;
                          }
                        })
                      ) : (
                        <>
                          
                          <OrderTableSkeleton></OrderTableSkeleton>
                          <OrderTableSkeleton></OrderTableSkeleton>
                          <OrderTableSkeleton></OrderTableSkeleton>
                          <OrderTableSkeleton></OrderTableSkeleton>
                        </>
                      )}

                      {/* Skeletons */}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="month">
              <Card x-chunk="dashboard-05-chunk-3">
                <CardHeader className="px-7">
                  <CardTitle>Orders</CardTitle>
                  <CardDescription>
                    Recent orders from your store.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className={"text-center"}>
                          Customer
                        </TableHead>
                        <TableHead className="text-center hidden sm:table-cell">
                          Type
                        </TableHead>
                        <TableHead className=" text-center hidden sm:table-cell">
                          Status
                        </TableHead>
                        <TableHead className="text-center hidden md:table-cell">
                          Date
                        </TableHead>
                        <TableHead className="text-center text-right">
                          Amount
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orders.map((session, i) => {
                        if (isDateLessThanAMonth(session.created)) {
                          return (
                            <>
                              <OrderRow
                                onClick={() => {
                                  setCardCount(i);
                                }}
                                order={session}
                              />
                            </>
                          );
                        }
                      })}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="year">
              <Card x-chunk="dashboard-05-chunk-3">
                <CardHeader className="px-7">
                  <CardTitle>Orders</CardTitle>
                  <CardDescription>
                    Recent orders from your store.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className={"text-center"}>
                          Customer
                        </TableHead>
                        <TableHead className="text-center hidden sm:table-cell">
                          Type
                        </TableHead>
                        <TableHead className=" text-center hidden sm:table-cell">
                          Status
                        </TableHead>
                        <TableHead className="text-center hidden md:table-cell">
                          Date
                        </TableHead>
                        <TableHead className="text-center text-right">
                          Amount
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orders.map((session, i) => {
                        if (isDateLessThanAYear(session.created)) {
                          return (
                            <>
                              <OrderRow
                                onClick={() => {
                                  setCardCount(i);
                                }}
                                order={session}
                              />
                            </>
                          );
                        }
                      })}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        {orders.length > 0 && (
          <OrderCard
            setCardCount={setCardCount}
            cardCount={cardCount}
            orderLength={orders.length}
            order={orders.at(cardCount)}
          />
        )}
      </div>
    </div>
  );
}

export default Orders;
