import type {Request,Response} from "express"
import User from "../models/Users.js"
import {admin} from "../middleware/authMiddleware.js"



export const getUsers = async(req:Request, res:Response) => {
 

  try {
    const users = await User.find({}).select('-password')
    if(users.length===0){
      res.status(404).json({message:"Users not found"})
      return;
    }
    res.status(200).json(users)

    
  } catch (error) {
    console.log(error)
    res.status(500).json({message:"Server Error"})
  }

}

export const getUsersById = async(req:Request, res:Response) => {
  const userId = req.params.id
  try {
    const user =  await User.findById(userId).select('-password')
    if(user){
      res.status(200).json(user)
    }
    else{
      res.status(404).json({message:"User Not Found"});
      return;
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({message:"Server Error"})

    
  }
}

export const updateUser = async(req:Request,res:Response) => {
  const userId = req.params.id;
  const {name,email,isAdmin} = req.body;

  try {
    const user = await User.findById(userId);
    if(user){
      user.name = name || user.name;
      user.email = email || user.email;
      user.isAdmin = isAdmin !== undefined ? isAdmin : user.isAdmin

      const updateUser = await user.save();
      res.status(200).json(updateUser)
    }
    else{
      res.status(404).json({message:"User Not Found"})
    }
    
  } catch (error) {
    console.log(error);
    res.status(500).json({message:"Server Error"})
  }
}


export const deleteUser = async (req:Request, res:Response) => {
  const userId = req.params.id;

  try{
    const user = await User.findById(userId);
    if(user){
      await user.deleteOne();
      res.status(200).json({message:"User removed"})
    }
    else{
      res.status(404).json({message:"User Not Found"})
    }
  }catch(error){
    console.log(error);
    res.status(500).json({message:"Server Error"})
  }
}
