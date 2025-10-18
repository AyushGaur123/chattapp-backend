import mongoose from "mongoose"
import dotenv from "dotenv";
dotenv.config();

// const Mongo_URL="mongodb://localhost:27017/chatapp"

const Mongo_URL=process.env.MONGO_URL
export const connectDB = async ()=>{

    try{
        const conn = await mongoose.connect( Mongo_URL)
        console.log("mongodb connected")
    }catch(error){
        console.log("mongo connection error",error)
    }
}