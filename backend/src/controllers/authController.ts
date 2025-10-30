import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/userModel";

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";
 
export const register = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "Email already exists" });

    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: hashed });
    await user.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
 
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });
 
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ message: "Invalid credentials" });
 
    const token = jwt.sign({ id: user._id, username: user.username }, JWT_SECRET, { expiresIn: "1d" });
 
    res.json({ message: "Login successful",data:user,token: token });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const addScore = async (req: Request, res: Response) => {
  try {
     const { email } = req.body;
 
const user = await User.findOneAndUpdate(
  { email },
  { $inc: { score: 1 } },
  { new: true }  
);
 
    if (!user) return res.status(404).json({ message: "User not found" });
 
    res.json({ message: "added successful" ,data:user});
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};


export const fetchScore = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ message: "fetch successful" ,data:user,});
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const fetchAllScore = async (req: Request, res: Response) => {
  try {
 
const users = await User.find().sort({ score: -1 });

    if (!users) return res.status(404).json({ message: "Usesr not found" });

    res.json({ message: "users founded" ,data:users});
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};