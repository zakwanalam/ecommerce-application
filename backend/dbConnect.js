import mongoose from "mongoose";
import  connection  from "mongoose";

async function databaseConnect(){
    if(connection.isConnected){
        console.log("already connected")
        return;
    }
    try {
        const db = await mongoose.connect("mongodb+srv://zakwan2:zakwan123@next-project.utkkkvj.mongodb.net/?retryWrites=true&w=majority&appName=next-project")
        connection.isConnected= db.connections[0].readyState;
        console.log("Database connected successfully")
        return
    } catch (error) {
        process.exit;
        console.log("Connection Failed",error)
    }
}
export default databaseConnect