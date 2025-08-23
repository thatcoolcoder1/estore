//authControllers

import type { Request, Response } from "express";
import bcrypt from "bcrypt";
import User from "../models/Users.js"
import jwt, { Secret } from "jsonwebtoken";
import dotenv from 'dotenv';

// Configure dotenv to load variables from the root directory
dotenv.config({ path: '.env' });





//Register
export const register = async (req: Request, res: Response) => {


  const { name, email, password } = req.body;
  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      res.status(409).json({ message: "User with this email already exists." })
      return;

    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);


    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();


    res.status(201).json({
      message: "User registered successfully",
      data: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
      },
    });


  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error during registration." });

  }
  // console.log(User, Password);
  // res.json({ message: "Register received", User, Password });
};




export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    console.log(user)
    // If no user found
    if (!user) {
      console.log("❌ No user found with email:", email);
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    console.log(user)

    // If user exists, compare password
    const isMatch = await bcrypt.compare(password, user.password);
    console.log(isMatch)
    if (!isMatch) {
      console.log("❌ Wrong password for:", email);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // If match, generate token
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT as Secret,
      { expiresIn: '1h' }
    );

    res.status(200).json({
      message: 'Login successful',
      token: token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
;
