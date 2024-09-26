import mongoose from "mongoose";

export const connectToDb = async()=>{
    try {
        await mongoose.connect("mongodb://localhost:27017/GeminiClone");
        console.log("DataBase connect successfully");
    } catch (error) {
        console.log("DataBase did not connect",error)
    }
}