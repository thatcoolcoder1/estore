import type { Request,Response } from "express"
import Cart from "../models/Cart.js"
import User, { IUserModel } from "../models/Users.js"
import Product from "../models/Product.js";
import { Types } from "mongoose";

declare global {
    namespace Express {
        interface Request {
            user?: IUserModel;
        }
    }
}

export const getCart = async (req: Request, res: Response) => {
    try {
        if (!req.user) {
            // This is a failsafe for type safety, though it shouldn't be reached
            return res.status(401).json({ message: "User not authenticated" });
        }

        const cart = await Cart.findOne({ user: req.user._id });

        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        res.status(200).json(cart);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};
export const addItem = async (req: Request, res: Response) => {
    // Check if user is authenticated (added for type safety)
    if (!req.user) {
        return res.status(401).json({ message: "User not authenticated" });
    }

    const userId = req.user._id;
    const { productId, quantity } = req.body;

    try {
        let cart = await Cart.findOne({ user: userId });
        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        const cartItem = {
            product: productId,
            title: product.title,
            image: product.image && product.image.length > 0 ? [product.image[0]] : ['https://placehold.co/100x100/A8A8A8/ffffff?text=No+Image'], // Use the first image for the cart
            price: product.price,
            quantity: quantity,
        };

        if (cart) {
            // Cart exists, check if the item is already in it
            const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);

            if (itemIndex > -1) {
                // Item exists in the cart, update the quantity
                cart.items[itemIndex].quantity += quantity;
            } else {
                // Item does not exist, add it to the cart
                cart.items.push(cartItem);
            }
            cart.totalPrice += product.price * quantity;

            const updatedCart = await cart.save();
            res.status(200).json(updatedCart);
        } else {
            // No cart exists, create a new one
            const newCart = await Cart.create({
                user: userId,
                items: [cartItem],
                totalPrice: product.price * quantity,
            });
            res.status(201).json(newCart);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const deleteItem = async (req: Request, res: Response) => {
    if (!req.user) {
        return res.status(401).json({ message: "User not authenticated" });
    }

    const userId = req.user._id;
    const { productId } = req.body;

    try {
        const cart = await Cart.findOne({ user: userId });

        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);

        if (itemIndex > -1) {
            // Remove the item at the found index
            const removedItem = cart.items.splice(itemIndex, 1)[0];
            
            // Subtract the price of the removed item from the total price
            cart.totalPrice -= removedItem.price * removedItem.quantity;
            
            const updatedCart = await cart.save();
            res.status(200).json(updatedCart);
        } else {
            res.status(404).json({ message: "Product not found in cart" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const updateItemQuantity = async (req:Request, res:Response) => {
    if(!req.user){
        return res.status(401).json({ message: "User not authenticated" });
    }
    const userId = req.user._id
    const {productId,quantity} = req.body;
    try {
        const cart = await Cart.findOne({user:userId})
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }
        const itemIndex = cart.items.findIndex(item => item.product.toString() === productId)
        if (itemIndex > -1){
            const item = cart.items[itemIndex];
            const oldQuantity = item.quantity;
            
            // Update the quantity and recalculate the total price
            item.quantity = quantity;
            cart.totalPrice += item.price * (quantity - oldQuantity);
            
            const updatedCart = await cart.save();
            res.status(200).json(updatedCart);



        }
        else {
            res.status(404).json({ message: "Product not found in cart" });
        }


        
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }

}

export const clearCart = async (req:Request, res: Response) => {
    if (!req.user){
        return res.status(401).json({ message: "User not authenticated" });
    }
    const userId = req.user._id
    // let {productId,quantity} = req.body;
    try {
        const cart= await Cart.findOne({user:userId})

        if(!cart){
            return res.status(404).json({ message: "Cart not found" });
        }

        cart.items = [];
        cart.totalPrice = 0;
        const updatedCart = await cart.save();
        res.status(200).json(updatedCart);

        
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
    
}