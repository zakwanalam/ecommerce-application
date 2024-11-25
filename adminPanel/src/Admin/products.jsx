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
export function Prodcut(props) {

  const deleteProduct = async (productId) => {
    console.log('hello');
    
    const response = await axios.delete('/api/deleteProduct', {
      params: {
        productId:productId
      }
    })
    if(response.data.success){
        window.location.reload()
    }
  }
  const [imageHidden, setImageHidden] = useState(true);
  const nav = useNavigate();
  console.log("from product", props.productList);
  return (
    <div className="md:pl-14">
      <div className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
        <Tabs defaultValue="all">
          <div className="flex items-center">
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="draft">Draft</TabsTrigger>
              <TabsTrigger value="archived" className="hidden sm:flex">
                Archived
              </TabsTrigger>
            </TabsList>
            <div className="ml-auto flex items-center gap-2">
              <DropdownMenu>
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
              <Button
                onClick={() =>
                  exportJSONToCSV(props.productList, "products", [
                    "image_main",
                    "image_secondary_1",
                    "image_secondary_2",
                  ])
                }
                size="sm"
                variant="outline"
                className="h-7 gap-1"
              >
                <File className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                  Export
                </span>
              </Button>
              <Link to={"/product/editProduct"}>
                <Button size="sm" className="h-7 gap-1">
                  <PlusCircle className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    Add Product
                  </span>
                </Button>
              </Link>
            </div>
          </div>
          <TabsContent value="all">
            <Card x-chunk="dashboard-06-chunk-0">
              <CardHeader>
                <CardTitle>Products</CardTitle>
                <CardDescription>
                  Manage your products and view their sales performance.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="hidden w-[100px] text-center sm:table-cell">
                        <span className="sr-only">Image</span>
                      </TableHead>
                      <TableHead className={"text-center"}>Name</TableHead>
                      <TableHead className={"text-center"}>Status</TableHead>
                      <TableHead className={"text-center"}>Price</TableHead>
                      <TableHead className="hidden text-center md:table-cell">
                        Total Sales
                      </TableHead>

                      <TableHead>
                        <span className="sr-only">Actions</span>
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {props.productList.map((product, i) => {
                      return (
                        <TableRow key={i}>
                          <TableCell className="hidden relative sm:table-cell">
                            <img
                              alt="Product image"
                              hidden={imageHidden}
                              onLoad={() => {
                                setImageHidden(false);
                              }}
                              className=" aspect-square absolute h-16 w-16 rounded-md object-cover"
                              src={product.image_main}
                            />
                            <div
                              className={` w-16 h-16 aspect-square rounded-md   bg-slate-100 ${imageHidden === true ? "animate-pulse" : ""
                                }`}
                            ></div>
                          </TableCell>
                          <TableCell className="font-medium">
                            {product.name}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{product.status}</Badge>
                          </TableCell>
                          <TableCell>${product.stock[0].price}</TableCell>
                          <TableCell className="hidden md:table-cell">
                            {product.sales}
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            {""}
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
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
                                <DropdownMenuItem
                                  onClick={() => {
                                    nav("/product/editProduct", {
                                      state: product,
                                    });
                                  }}
                                >
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={()=>{deleteProduct(product.id)}}>Delete</DropdownMenuItem>
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

          <TabsContent value="active">
            <Card x-chunk="dashboard-06-chunk-0">
              <CardHeader>
                <CardTitle>Products</CardTitle>
                <CardDescription>
                  Manage your products and view their sales performance.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="hidden w-[100px] text-center sm:table-cell">
                        <span className="sr-only">Image</span>
                      </TableHead>
                      <TableHead className={"text-center"}>Name</TableHead>
                      <TableHead className={"text-center"}>Status</TableHead>
                      <TableHead className={"text-center"}>Price</TableHead>
                      <TableHead className="hidden text-center md:table-cell">
                        Total Sales
                      </TableHead>

                      <TableHead>
                        <span className="sr-only">Actions</span>
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {props.productList.map((product, i) => {
                      if (product.status === "Active") {
                        return (
                          <TableRow key={i}>
                            <TableCell className="hidden sm:table-cell">
                              <img
                                alt="Product image"
                                hidden={imageHidden}
                                onLoad={() => {
                                  setImageHidden(false);
                                }}
                                className=" aspect-square absolute h-16 w-16 rounded-md object-cover"
                                src={product.image_main}
                              />
                              <div
                                className={` w-16 h-16 aspect-square rounded-md   bg-slate-100 ${imageHidden === true ? "animate-pulse" : ""
                                  }`}
                              ></div>
                            </TableCell>
                            <TableCell className="font-medium">
                              {product.name}
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">{product.status}</Badge>
                            </TableCell>
                            <TableCell>${product.stock[0]?.price || 'Please Update Stock'}</TableCell>
                            <TableCell className="hidden md:table-cell">
                              25
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                              {""}
                            </TableCell>
                            <TableCell>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
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
                                  <DropdownMenuItem
                                    onClick={() => {
                                      nav("/product/editProduct", {
                                        state: product,
                                      });
                                    }}
                                  >
                                    Edit
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={()=>{deleteProduct(product.id)}}>Delete</DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        );
                      }
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

          <TabsContent value="archived">
            <Card x-chunk="dashboard-06-chunk-0">
              <CardHeader>
                <CardTitle>Products</CardTitle>
                <CardDescription>
                  Manage your products and view their sales performance.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="hidden w-[100px] text-center sm:table-cell">
                        <span className="sr-only">Image</span>
                      </TableHead>
                      <TableHead className={"text-center"}>Name</TableHead>
                      <TableHead className={"text-center"}>Status</TableHead>
                      <TableHead className={"text-center"}>Price</TableHead>
                      <TableHead className="hidden text-center md:table-cell">
                        Total Sales
                      </TableHead>

                      <TableHead>
                        <span className="sr-only">Actions</span>
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {props.productList.map((product, i) => {
                      if (product.status === "Archived") {
                        return (
                          <TableRow key={i}>
                            <TableCell className="hidden sm:table-cell">
                              <img
                                alt="Product image"
                                hidden={imageHidden}
                                onLoad={() => {
                                  setImageHidden(false);
                                }}
                                className=" aspect-square absolute h-16 w-16 rounded-md object-cover"
                                src={product.image_main}
                              />
                              <div
                                className={` w-16 h-16 aspect-square rounded-md   bg-slate-100 ${imageHidden === true ? "animate-pulse" : ""
                                  }`}
                              ></div>
                            </TableCell>
                            <TableCell className="font-medium">
                              {product.name}
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">{product.status}</Badge>
                            </TableCell>
                            <TableCell>${product.stock[0].price}</TableCell>
                            <TableCell className="hidden md:table-cell">
                              25
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                              {""}
                            </TableCell>
                            <TableCell>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
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
                                  <DropdownMenuItem
                                    onClick={() => {
                                      nav("/product/editProduct", {
                                        state: product,
                                      });
                                    }}
                                  >
                                    Edit
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={()=>{deleteProduct(product.id)}}>Delete</DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        );
                      }
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

          <TabsContent value="draft">
            <Card x-chunk="dashboard-06-chunk-0">
              <CardHeader>
                <CardTitle>Products</CardTitle>
                <CardDescription>
                  Manage your products and view their sales performance.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="hidden w-[100px] text-center sm:table-cell">
                        <span className="sr-only">Image</span>
                      </TableHead>
                      <TableHead className={"text-center"}>Name</TableHead>
                      <TableHead className={"text-center"}>Status</TableHead>
                      <TableHead className={"text-center"}>Price</TableHead>
                      <TableHead className="hidden text-center md:table-cell">
                        Total Sales
                      </TableHead>

                      <TableHead>
                        <span className="sr-only">Actions</span>
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {props.productList.map((product, i) => {
                      if (product.status === "Draft") {
                        return (
                          <TableRow key={i}>
                            <TableCell className="hidden sm:table-cell">
                              <img
                                alt="Product image"
                                hidden={imageHidden}
                                onLoad={() => {
                                  setImageHidden(false);
                                }}
                                className=" aspect-square absolute h-16 w-16 rounded-md object-cover"
                                src={product.image_main}
                              />
                              <div
                                className={` w-16 h-16 aspect-square rounded-md   bg-slate-100 ${imageHidden === true ? "animate-pulse" : ""
                                  }`}
                              ></div>
                            </TableCell>
                            <TableCell className="font-medium">
                              {product.name}
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">{product.status}</Badge>
                            </TableCell>
                            <TableCell>${product.stock.small.price}</TableCell>
                            <TableCell className="hidden md:table-cell">
                              25
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                              {""}
                            </TableCell>
                            <TableCell>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
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
                                  <DropdownMenuItem
                                    onClick={() => {
                                      nav("/product/editProduct", {
                                        state: product,
                                      });
                                    }}
                                  >
                                    Edit
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={()=>{deleteProduct(product.id)}}> Delete</DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        );
                      }
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
