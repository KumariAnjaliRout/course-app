import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { v2 as cloudinary } from "cloudinary";

import courseRoute from "./routes/course.route.js";
import userRoute from "./routes/user.route.js";
import adminRoute from "./routes/admin.route.js";
import orderRoute from "./routes/order.route.js";

import cors from "cors";
import fileUpload from "express-fileupload";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // To parse URL-encoded data
app.use(cookieParser());
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);


app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true); // Allow requests with no origin

      // Allow localhost (any port) + all Vercel deployments
      if (origin.startsWith("http://localhost:") || origin.endsWith(".vercel.app")) {
        return callback(null, true);
      }

      console.warn(` CORS blocked request from origin: ${origin}`);
      callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);



// Last middleware to catch errors
app.use((err, req, res, next) => {
  console.error("Global Error Handler:", err);
  res.status(500).json({ errors: err.message || "Internal Server Error" });
});


// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const PORT = process.env.PORT || 3000;
const DB_URI = process.env.MONGO_URI;

async function startServer() {
  try {
    await mongoose.connect(DB_URI);
    console.log("Connected to MongoDB");

    // Define routes
    app.use("/api/v1/course", courseRoute);
    app.use("/api/v1/user", userRoute);
    app.use("/api/v1/admin", adminRoute);
    app.use("/api/v1/order", orderRoute);

    // Error-handling middleware (for catching errors in routes)
    app.use((err, req, res, next) => {
      console.error("Unhandled error:", err);
      res.status(500).json({ errors: "Something went wrong!" });
    });

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to connect to MongoDB", error);
    process.exit(1);
  }
}

startServer();
