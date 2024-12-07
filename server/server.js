import express from 'express';
import colors from 'colors';
import morgan from 'morgan';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cloudinary from 'cloudinary'

import connectDB from './config/db.js';

dotenv.config();

//database connection
connectDB();

//cloudinary config
cloudinary.v2.config({
    cloud_name:process.env.CLOUDINARY_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_SECRET,
})
const app=express()

app.use(morgan("dev"));
app.use(express.json());
app.use(cors());
app.use(cookieParser());

//route imports
import testRoutes from "./routes/testRoutes.js";
import userRoutes from "./routes/userRoutes.js";

app.use("/api/v1",testRoutes);  ///we can change these path name apne man se
app.use("/api/v1/user",userRoutes);



app.get('/',(req,res)=>{
    return res.status(200).send("<h1> Welcome to Node Server</h1>");

})

const PORT= process.env.PORT || 8080;

app.listen(PORT,()=>{
    console.log(`Server Running On PORT ${process.env.PORT} on ${process.env.NODE_ENV}Mode`.bgMagenta.white);
})