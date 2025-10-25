import express from "express"
import {connectDB} from "./lib/db.js"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import authRoutes from "./routes/auth.route.js"
import messageRoutes from "./routes/message.route.js"
import {app,server} from "./lib/socket.js"
import cors from "cors"

dotenv.config()

app.use(express.json({ limit: "10mb" })); // allows up to 10MB of JSON data
app.use(express.urlencoded({ limit: "10mb", extended: true }));

app.use(cors(
    {
    origin:[
        "http://localhost:5173",
        "https://chatt-app-xt6j.onrender.com"
    ],
    credentials:true
}
))
app.use(cookieParser())



app.use("/api/auth",authRoutes)
app.use("/api/messages",messageRoutes)


server.listen(3000,()=>{
    console.log("server running on port 3000")
    connectDB()
}
)