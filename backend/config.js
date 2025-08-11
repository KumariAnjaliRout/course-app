import dotenv from "dotenv";
dotenv.config();

const PORT = process.env.PORT || 4001; // default port if not set
const MONGO_URI = process.env.MONGO_URI;

const CLOUD_NAME = process.env.CLOUD_NAME;
const API_KEY = process.env.API_KEY;
const API_SECRET = process.env.API_SECRET;

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_USER_PASSWORD = process.env.JWT_USER_PASSWORD;
const JWT_ADMIN_PASSWORD = process.env.JWT_ADMIN_PASSWORD;

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;

export default {
  PORT,
  MONGO_URI,
  CLOUD_NAME,
  API_KEY,
  API_SECRET,
  JWT_SECRET,
  JWT_USER_PASSWORD,
  JWT_ADMIN_PASSWORD,
  STRIPE_SECRET_KEY,
};

