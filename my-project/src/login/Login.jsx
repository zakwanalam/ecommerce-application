import { Link } from "react-router-dom";
import { Button, buttonVariants } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { useNavigate } from "react-router-dom";

export function LoginForm(props) {
  const [formData, setformData] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    async () => {
      const response = await axios.get("/api/verifySession");
      if (response.data.success) {
        navigate("/home");
      }
    };
  }, [navigate]);

  const handleSubmit = async () => {
    console.log(formData);
    const response = await axios.get("/api/login", { params: formData });
    console.log(response.data.success);
    if (response.data.success === true) {
      toast({
        variant: "success",
        title: "Login was successful",
      });

      setTimeout(() => {
        navigate("/home");
        window.location.reload();
      }, 1500);
      return;
    } else if (response.data.isNotVerified) {
      toast({
        variant: "destructive",
        title: "Account Not Verified",
      });
    } else if (response.data.isNotRegistered) {
      toast({
        variant: "destructive",
        title: "Register Your Account First",
      });
    } else {
      toast({
        variant: "destructive",
        title: "Invalid Username Or Password",
      });
    }
  };

  const handleAdminLogin = async () => {
    const adminData = { email: formData.email, password: formData.password };
    const response = await axios.post("/api/verifyAdmin", adminData);
    if (response.data.success === true) {
      toast({
        variant: "success",
        title: "Welcome to Admin Panel",
      });
      navigate("/admin/dashboard");
    } else {
      toast({
        variant: "destructive",
        title: "Invalid Username Or Password",
      });
    }
  };

  const handleOnCange = (e) => {
    const { name, value } = e.target;
    setformData({
      ...formData,
      [name]: value,
    });
  };

  return (
    <div className="flex justify-center bg-indigo-950 items-center min-w-md min-h-screen">
      <Card className="mx-auto max-w-sm items-center">
        <CardHeader>
          <CardTitle className="text-2xl text-indigo-600 mb-1">
            {props.title}
          </CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                name="email"
                onChange={handleOnCange}
                placeholder="m@example.com"
                required
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                <Link
                  to={"/forgetPassword"}
                  className="ml-auto inline-block text-sm underline"
                >
                  Forgot your password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                onChange={handleOnCange}
                name="password"
                required
              />
            </div>
            <Link
              onClick={
                props.adminStatus === true ? handleAdminLogin : handleSubmit
              }
            >
              <Button
                type="submit"
                className="w-full bg-indigo-500 hover:bg-indigo-700"
              >
                Login
              </Button>
              <Toaster />
            </Link>
          </div>
          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link to={"/Signup"} className="underline font-semibold">
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
