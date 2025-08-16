import { Request, Response, NextFunction } from 'express';
import jwt, { Secret } from 'jsonwebtoken';
import User, { IUserModel } from '../models/Users';
import dotenv from 'dotenv';

// Configure dotenv to load variables from the root directory
dotenv.config({ path: '.env' });

// The Request type needs to be extended to include the 'user' property we will attach
declare global {
    namespace Express {
        interface Request {
            user?: IUserModel;
        }
    }
}


export const protect = async (req:Request, res:Response ,next:NextFunction) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        try{

            token = req.headers.authorization.split(' ')[1]
            //jwt verify, verifies and decodes the token in middle to original json values
            const decoded:any = jwt.verify(token, process.env.JWT as Secret)
            //using id attr of db to find user, req.user acts as a container for storing id.
            req.user = await User.findById(decoded.id).select('-password')
            if (!req.user){
                res.status(401).json({message:'Not Authorized'});
                return;
            }
            next();
        }
        catch(error){
            console.log(error);
            res.status(401).json({message:'Token Failed'});
            return;

        }
    }
    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token' });
        return;
    }
} 


export const admin =  (req:Request, res:Response, next:NextFunction) => {
    if (req.user && req.user.isAdmin){
        next();
    }
    else{
        res.status(403).json({message:'Not Authorized as an Admin'});
    }
    
}