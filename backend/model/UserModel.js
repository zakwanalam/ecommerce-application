import mongoose, {Schema,Document, Types} from "mongoose";



const UserSchema = new Schema({
    email:{
        type:String,
        required:true
    },
    fullName:{
        type:String,
        required:true
    },
    address:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    expiry:{
        type:Date,
        required:true
    },
    verifyCode:{
        type:String,
        required:true
    },
    isVerified:{
        type:Boolean,
        default:false
    }
})

const UserModel = (mongoose.model("User",UserSchema))
export default UserModel