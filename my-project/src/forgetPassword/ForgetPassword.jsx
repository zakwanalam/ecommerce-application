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
import { useState } from "react";
import { toast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { useNavigate } from "react-router-dom";
import { hash } from "bcryptjs";
import { EmailSchema, PasswordSchema } from "@/schemas/SignupSchema";


function ForgetPassword() {
  const [formData,setFormData] = useState({email:'',password:'',confirmPassword:''})
  const navigate = useNavigate()

  const handleOnChange  = (e)=>{
    const {name,value} = e.target
    setFormData({
      ...formData,
      [name]:value
    })
  }
  const handleSubmit  = async()=>{

    if(formData.confirmPassword != formData.password){
      toast({
        variant:"destructive",
        title:"Passwords do not match"
      })
      return
    }
    const emailRes = EmailSchema.safeParse({email:formData.email})
    console.log(emailRes.success)
    
    if(!emailRes.success){
      toast({
          variant:'destructive',
          title:"Invalid Data",
          description:"Invalid Email"
      })
      return
    }
    const passRes =  PasswordSchema.safeParse({password:formData.password})
    
    if(!passRes.success){
        toast({
            variant:'destructive',
            title:"Invalid Data",
            description:"Password must be atleast 8 characters and contain atleast one special character or underscore"
        })
        return
    }
    
    else{
      const response = await axios.get('/api/resend',{params:{email:formData.email}})
      if(response.data.success===true){
        toast({
          variant:"success",
          title:"Success",
          description:"Please Verify Your Account "
        })
        setTimeout(async()=>{
          const hashedPassword = await hash(formData.password,10)
          navigate(`/verify?email=${formData.email}&password=${hashedPassword}`)
        },1500)        
      }
      else{
        toast({
          variant:"destructive",
          title:"Invalid Email Address"
        })
      }
    }
  }
  return (
<div className="flex justify-center bg-indigo-950 items-center min-w-md min-h-screen">
      <Card className="mx-auto max-w-sm items-center">
        <CardHeader>
          <CardTitle className="text-2xl text-indigo-600 mb-1">Forget Password</CardTitle>
          <CardDescription>
            Enter your email and confirm your password
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
                onChange={handleOnChange}
                placeholder="m@example.com"
                required
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
            <Label htmlFor="password">Password</Label>
              </div>
              <Input
                id="password"
                type="password"
                onChange={handleOnChange}
                name="password"
                required
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
            <Label htmlFor="password">Confirm Password</Label>
              </div>
              <Input
                id="password"
                type="password"
                onChange={handleOnChange}
                name="confirmPassword"
                required
              />
            </div>
            <Link onClick={handleSubmit}>
              <Button
                type="submit"
                className="w-full bg-indigo-500 hover:bg-indigo-700"
              >
                Send Verification Email
              </Button>
              <Toaster />
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default ForgetPassword