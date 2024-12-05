import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv"
import database from "./config/database.js";
import {cloudinaryConnect} from "./config/cloudinary.js";
import fileUpload from "express-fileupload";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/user.routes.js";
// import courseRoutes from "./routes/course.routes.js";


const app = express();
dotenv.config();

const PORT = process.env.PORT || 8080;
database.connect();

app.use(cors(
    {
        origin:"http://localhost:3000",
        credentials:true
    }
));
app.use(fileUpload(
    {
        useTempFiles:true,
        tempFileDir:"/tmp/"
    }
));
//cloudinary connection
cloudinaryConnect();

app.use(cookieParser());
app.use(express.json());

app.use("/api/v1/auth", userRoutes);
// app.use("/api/v1", courseRoutes);

app.get("/", (req, res) => {
    return res.status(200).json({
        success: true,
        message: "Welcome to EduTrack"
    })
})


