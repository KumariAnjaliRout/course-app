import dotenv from "dotenv";
dotenv.config();

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { Admin } from "../models/admin.model.js";

export const signup = async (req, res) => {
  const adminSchema = z.object({
    firstName: z.string().min(3, { message: "firstName must be at least 3 characters long" }),
    lastName: z.string().min(3, { message: "lastName must be at least 3 characters long" }),
    email: z.string().email(),
    password: z.string().min(6, { message: "password must be at least 6 characters long" }),
  });

  const validatedData = adminSchema.safeParse(req.body);
  if (!validatedData.success) {
    return res.status(400).json({ errors: validatedData.error.issues.map(err => err.message) });
  }

  const { firstName, lastName, email, password } = req.body;

  try {
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ errors: "Admin already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = new Admin({ firstName, lastName, email, password: hashedPassword });
    await newAdmin.save();

    res.status(201).json({ message: "Signup succeeded", admin: newAdmin });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ errors: "Error in signup" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ errors: "All fields are required" });
    }

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(401).json({ errors: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ errors: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: admin._id },
      process.env.JWT_ADMIN_PASSWORD,  // Make sure this is set correctly in your .env
      { expiresIn: "1d" }
    );

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      admin: {
        id: admin._id,
        email: admin.email,
        firstName: admin.firstName,
        lastName: admin.lastName,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ errors: "Server error during login" });
  }
};

export const logout = (req, res) => {
  try {
    res.clearCookie("jwt"); // If you use cookies to store JWT
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ errors: "Error in logout" });
  }
};
export const dashboard = (req, res) => {
  res.json({ message: "Welcome to Admin Dashboard" });
};

