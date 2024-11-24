import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Cross1Icon, Cross2Icon } from "@radix-ui/react-icons"
import { useState } from "react"


function StockVariant({toggleStockVariant,setToggle}) {
    return(
        <>
            <div  className={`fixed inset-0 transition-opacity duration-200  ${toggleStockVariant?'opacity-100':'opacity-0 pointer-events-none'} backdrop-blur-[5px] flex justify-center items-center z-50`}>
                <Card className={`absolute   z-10 w-[350px] translate-x-[-50%] translate-y-[-50%] left-[50%] top-[50%]`}>
                    <CardHeader>
                        <Cross2Icon onClick={()=>setToggle(false)} className="cursor-pointer scale-125"/>
                        <CardTitle className="font-semibold text-2xl">Create Stock Variant</CardTitle>
                        <CardDescription>Add A New Stock Type</CardDescription>
                        <form action="">
                            <div className="grid w-full items-center gap-4">
                                <div className="flex flex-col space-y-1.5">
                                    <Label>Size</Label>
                                    <Input />
                                </div>
                                <div className="flex flex-col space-y-1.5">
                                    <Label>Price</Label>
                                    <Input />
                                </div>
                                <div className="flex flex-col space-y-1.5">
                                    <Label>Quantity</Label>
                                    <Input />
                                </div>
                            </div>
                        </form>
                    </CardHeader>
                    <CardFooter>
                        <Button>Add</Button>
                    </CardFooter>
                </Card>
            </div>
        </>
    )
}
export default StockVariant