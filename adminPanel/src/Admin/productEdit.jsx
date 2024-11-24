import { ChevronLeft, PlusCircle, Upload } from "lucide-react";
import { Badge } from "@/components/ui/badge";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { json, Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import StockVariant from "./StockVariant";

function ProductEdit() {
  const location = useLocation();
  console.log(location.state);
  const [product, setProduct] = useState(() => {
    return (
      location.state || {
        name: "",
        image_main:
          "https://upload.wikimedia.org/wikipedia/commons/3/3f/Placeholder_view_vector.svg",
        description: "",
        stock: [],
        image_secondary_1: "",
        image_secondary_2: "",
        status: "",
        category: "",
        subCategory: "",
        id: "",
        sales: 0,
      }
    );
  });
  const [imageHidden, setImageHidden] = useState(true);
  const [imageHidden2, setImageHidden2] = useState(true);
  const [imageHidden3, setImageHidden3] = useState(true);

  const placeholder =
    "https://upload.wikimedia.org/wikipedia/commons/3/3f/Placeholder_view_vector.svg";
  useEffect(() => console.log(product), [product]);

  const handleChange = (e) => {
    const { name, value } = e.target != null ? e.target : e;
    console.log(name);
    setProduct((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  const handleStockChange = (e, index) => {
    const { name, value } = e.target != null ? e.target : e;
    setProduct({
      ...product,
      stock: [
        ...product.stock.slice(0, index),
        {
          ...product.stock[index],
          [name]: parseInt(value)
        },
        ...product.stock.slice(index + 1),
      ]
    })
  }

  const handleSelectChange = (name, value) => {
    setProduct({
      ...product,
      [name]: value,
    });
  };

  const [key, setKey] = useState("");

  const handleFile = async (event) => {
    console.log("handlefile");
    const file = event.target.files[0];
    const reader = new FileReader();
    if (file) {
      if (key === "image_main") {
        setImageHidden(true);
      } else if (key === "image_secondary_1") {
        setImageHidden2(true);
      } else if (key === "image_secondary_2") {
        setImageHidden3(true);
      }
      reader.onload = async (e) => {
        const dataurl = e.target.result;
        const response = await axios.post(
          "/api/uploadImage",
          { dataurl },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const url = response.data.url;
        setProduct({
          ...product,
          [key]: url,
        });
        if (key === "image_main") {
          setImageHidden(false);
        } else if (key === "image_secondary_1") {
          setImageHidden2(false);
        } else if (key === "image_secondary_2") {
          setImageHidden3(false);
        }
        console.log("Data url", dataurl);
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    console.log(product.image_main);
    console.log(product);

    console.log("Secondary Images", product.images_secondary);
  }, [product]);

  const saveProductToDatabase = async () => {
    const response = await axios.post("/api/saveProduct", product);
    console.log(response.data.success);
    if (response.data.success === true) {
      nav("/product");
      window.location.reload();
      console.log(response.data.product);
    }
  };
  console.log(product.subCategory);
  const nav = useNavigate();
  const [toggleStockVariant,setToggle] = useState(false)

  return (
    <div className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
      <div className="mx-auto grid max-w-[59rem] relative flex-1 justify-center items-center auto-rows-max gap-4">
        <StockVariant toggleStockVariant={toggleStockVariant} setToggle={setToggle}/>
        <div className="flex items-center gap-4">
          <div
            onClick={() => {
              nav("/product");
              window.location.reload();
            }}
          >
            <Button variant="outline" size="icon" className="h-7 w-7">
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Back</span>
            </Button>
          </div>
          <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
            Pro Controller
          </h1>
          <Badge variant="outline" className="ml-auto sm:ml-0">
            In stock
          </Badge>
          <div className="hidden items-center gap-2 md:ml-auto md:flex">
            <Button
              onClick={() => {
                nav("/product");
                window.location.reload();
              }}
              variant="outline"
              size="sm"
            >
              Discard
            </Button>
            <Button onClick={saveProductToDatabase} size="sm">
              Save Product
            </Button>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
          <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
            <Card x-chunk="dashboard-07-chunk-0">
              <CardHeader>
                <CardTitle>Product Details</CardTitle>
                <CardDescription>
                  Lipsum dolor sit amet, consectetur adipiscing elit
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6">
                  <div className="grid gap-3">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      type="text"
                      className="w-full"
                      name="name"
                      defaultValue={product.name}
                      onChange={(e) => { handleChange(e) }}
                    />
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      name="description"
                      defaultValue={product.description}
                      onChange={(e) => { handleChange(e) }}
                      className="min-h-32"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card x-chunk="dashboard-07-chunk-1">
              <CardHeader>
                <CardTitle>Stock</CardTitle>
                <CardDescription>
                  Lipsum dolor sit amet, consectetur adipiscing elit
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>


                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-center w-[100px]">
                        SKU
                      </TableHead>
                      <TableHead>Stock</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead className="text-center w-[100px]">
                        Size
                      </TableHead>
                    </TableRow>

                  </TableHeader>
                  <TableBody>
                    {product.stock.map(
                      (stockItem, i) => {
                        return (
                          <TableRow>
                            <TableCell className="font-semibold">GGPC {stockItem.stock_item_id}</TableCell>
                            <TableCell>
                              <Label htmlFor="stock-1" className="sr-only">
                                Stock
                              </Label>
                              <Input
                                id="small"
                                type="number"
                                name="quantity"
                                defaultValue={stockItem.quantity}
                                onChange={(e) => { handleStockChange(e, i) }}
                              />
                            </TableCell>
                            <TableCell>
                              <Input
                                id="smallPrice"
                                type="number"
                                name="price"
                                defaultValue={stockItem.price}
                                onChange={(e) => { handleStockChange(e, i) }}
                              />
                            </TableCell>
                            <TableCell>
                              <Label>{stockItem.size}</Label>
                            </TableCell>
                          </TableRow>
                        )
                      }
                    )
                    }

                  </TableBody>
                </Table>
              </CardContent>
              <CardFooter className="justify-center border-t p-4">
                <Button onClick={() => setToggle(true)
                } size="sm" variant="ghost" className="gap-1">
                  <PlusCircle className="h-3.5 w-3.5" />
                  Add Variant
                </Button>
              </CardFooter>
            </Card>
            <Card x-chunk="dashboard-07-chunk-2">
              <CardHeader>
                <CardTitle>Product Category</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 sm:grid-cols-3">
                  <div className="grid gap-3">
                    <Label htmlFor="category">Category</Label>
                    <Select
                      onValueChange={(value) =>
                        handleSelectChange("category", value)
                      }
                      defaultValue={product.category}
                    >
                      <SelectTrigger id="category" aria-label="Select category">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem name="Category" value="Sports">
                          Sports
                        </SelectItem>
                        <SelectItem value="Casual">Casual</SelectItem>
                        <SelectItem value="Formal">Formal</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="subcategory">Subcategory (optional)</Label>
                    <Select
                      onValueChange={(value) =>
                        handleSelectChange("subCategory", value)
                      }
                      name="subCategory"
                      defaultValue={product.subCategory}
                    >
                      <SelectTrigger
                        id="subcategory"
                        aria-label="Select subcategory"
                      >
                        <SelectValue placeholder="Select subcategory" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Sports">Sports</SelectItem>
                        <SelectItem value="Casual">Casual</SelectItem>
                        <SelectItem value="Formal">Formal</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
            <Card x-chunk="dashboard-07-chunk-3">
              <CardHeader>
                <CardTitle>Product Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6">
                  <div className="grid gap-3">
                    <Label htmlFor="status">Status</Label>
                    <Select
                      onValueChange={(value) => {
                        handleSelectChange("status", value);
                      }}
                      defaultValue={product.status}
                    >
                      <SelectTrigger id="status" aria-label="Select status">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Draft">Draft</SelectItem>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Archived">Archived</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="overflow-hidden" x-chunk="dashboard-07-chunk-4">
              <CardHeader>
                <CardTitle>Product Images</CardTitle>
                <CardDescription>
                  Lipsum dolor sit amet, consectetur adipiscing elit
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 relative">
                  <div className=" relative aspect-square w-60 max-lg:w-48 max-lg:ml-1 ">
                    <img
                      alt="Product image"
                      hidden={imageHidden}
                      onLoad={() => {
                        setImageHidden(false);
                      }}
                      className="aspect-square z-0 h-full cursor-pointer w-full rounded-md object-cover"
                      src={product.image_main}
                    />

                    <div
                      hidden={imageHidden}
                      onClick={() => {
                        document.getElementById("input").click();
                        setKey("image_main");
                      }}
                      className="absolute  flex justify-center items-center  top-0 w-full bg-black/30 cursor-pointer aspect-square rounded-md opacity-0 transition-opacity duration-50 ease-in-out hover:opacity-100 "
                    >
                      <h1 className="text-white text-2xl text-opacity-70">
                        Upload Image
                      </h1>
                    </div>
                    <div
                      hidden={!imageHidden}
                      className={` absolute cursor-pointer aspect-auto w-full h-full  rounded-md  bg-slate-200   ${imageHidden === true ? "animate-pulse" : ""
                        } `}
                    ></div>
                    <input
                      id="input"
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        handleFile(e);
                      }}
                      style={{ display: "none" }}
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-2 max-lg:mx-1 ">
                    <div className="relative flex w-18 aspect-square ">
                      <img
                        alt="Product image"
                        className="aspect-square cursor-pointer w-full rounded-md object-cover"
                        height="84"
                        src={
                          product.image_secondary_1
                            ? product.image_secondary_1
                            : placeholder
                        }
                        hidden={imageHidden2}
                        onLoad={() => {
                          setImageHidden2(false);
                        }}
                        width="84"
                      />
                      <div
                        hidden={imageHidden2}
                        onClick={() => {
                          document.getElementById("input").click();
                          setKey("image_secondary_1");
                        }}
                        className="absolute  flex justify-center items-center  top-0 w-full bg-black/30 cursor-pointer aspect-square rounded-md opacity-0 transition-opacity duration-50 ease-in-out hover:opacity-100 "
                      >
                        <h1 className="text-white text-md text-opacity-70">
                          Upload Image
                        </h1>
                      </div>
                      <div
                        hidden={!imageHidden2}
                        className={`absolute cursor-pointer aspect-auto w-full h-full rounded-md bg-slate-200  ${imageHidden2 === true ? "animate-pulse" : ""
                          }`}
                      ></div>
                    </div>
                    <div className="relative flex w-18 aspect-square">
                      <img
                        alt="Product image"
                        className="aspect-square cursor-pointer w-full rounded-md object-cover"
                        height="84"
                        src={
                          product.image_secondary_2
                            ? product.image_secondary_2
                            : placeholder
                        }
                        hidden={imageHidden3}
                        onLoad={() => {
                          setImageHidden3(false);
                        }}
                        width="84"
                      />
                      <div
                        hidden={imageHidden3}
                        onClick={() => {
                          document.getElementById("input").click();
                          setKey("image_secondary_2");
                        }}
                        className="absolute  flex justify-center items-center  top-0 w-full bg-black/30 cursor-pointer aspect-square rounded-md opacity-0 transition-opacity duration-50 ease-in-out hover:opacity-100 "
                      >
                        <h1 className="text-white text-md text-opacity-70">
                          Upload Image
                        </h1>
                      </div>
                      <div
                        hidden={!imageHidden3}
                        className={`absolute cursor-pointer aspect-auto w-full h-full rounded-md bg-slate-200  ${imageHidden3 === true ? "animate-pulse" : ""
                          }`}
                      ></div>
                    </div>
                    <button
                      onClick={(e) => {
                        document.getElementById("input").click();
                        setKey("image_main");
                      }}
                      className="flex aspect-square w-full items-center justify-center rounded-md border border-dashed"
                    >
                      <Upload className="h-4 w-4 text-muted-foreground" />
                      <span className="sr-only">Upload</span>
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card x-chunk="dashboard-07-chunk-5">
              <CardHeader>
                <CardTitle>Archive Product</CardTitle>
                <CardDescription>
                  Lipsum dolor sit amet, consectetur adipiscing elit.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div></div>
                <Button size="sm" variant="secondary">
                  Archive Product
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
        <div className="flex items-center justify-center gap-2 md:hidden">
          <Button variant="outline" size="sm">
            Discard
          </Button>
          <Link onClick={() => console.log("rererer")}>
            <Button size="sm">Save Product</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ProductEdit;
