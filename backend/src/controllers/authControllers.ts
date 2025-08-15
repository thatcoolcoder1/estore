//authControllers

import type { Request, Response } from "express";
import bcrypt from "bcrypt";
import User from "../models/Users"
import jwt from "jsonwebtoken";
    




//Register
export const register = async(req: Request, res: Response) => {
    

    const { name,email, password } = req.body;
    try {
        const userExists = await User.findOne({email});

        if(userExists) {
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





export const login = async(req: Request, res: Response) => {
    const { email, password } = req.body;
    try {
        const userExists = await User.findOne({email})
        if(userExists){
            //check for password and then return to homepage
            const hashpass = userExists.password;
            const compare = await bcrypt.compare(password,hashpass);
            if(compare==true){
                const token = jwt.sign(
                { id: userExists._id, email: userExists.email },
                process.env.JWT_SECRET || "your-jwt-secret-key",
                { expiresIn: "1h" });
                res.status(200).json({
            message: "Login successful",
            token: token,
            user: {
                id: userExists._id,
                name: userExists.name,
                email: userExists.email,
            },
            });

            }
            else{
                return;
            }
        }
        else{
            res.json({message:"No user"})
        }
   
    } catch (error) {
         console.error(error);
        res.status(500).json({ message: "Server error" });
        
    }
};

