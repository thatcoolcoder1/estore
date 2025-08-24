import type { Request,Response } from "express";
import Products from "../models/Product.js"

// /products/category/:category
export const getProductByCategory = async (req:Request, res:Response) => {
    try {
        const categoryurl = req.params.category
        const ProductExists = await Products.find({category:categoryurl})
        if(ProductExists.length === 0){
            res.status(404).json({ message: "No products found in this category" });
            return;
        }
        res.status(200).json(ProductExists);
        
    }
    catch(error){
        console.error(error);
        res.status(500).json({ message: 'Server error.' });

    }
}

// /products/id/:id
export const getProductById = async (req:Request, res:Response) => {
    const pid = req.params.id 
    try {
        const products = await Products.findById(pid)
        if (products){
            res.status(200).json(products)
        }
        else{
            res.status(404).json({message:"No Product by this ID"})

        }
        
    } catch (error) {
        console.log(error)
        res.status(500).json({message:"Server Error"})
        
    }
    
}


//
export const createProduct = async (req:Request, res:Response) => {
        const { title, description, image, price, category, countInStock } = req.body;

        if(!title|| !description|| !image|| !price|| !category||!countInStock){
            res.status(400).json({message:"Value not proided"});
            return;
        }
        try {
            
            const newProduct = new Products({
                title, description, image, price, category, countInStock
            })
            const createdProduct = await newProduct.save();
            res.status(201).json(createdProduct);
            
            
        } 
            
        catch (error) {
             console.error(error);
            res.status(500).json({ message: 'Server error' });
        }
    
}

export const updateProduct = async (req:Request, res:Response) => {
    const { title, description, image, price, category,countInStock } = req.body;
    
    try {
        const product = await Products.findById(req.params.id)
        
        if (product){
            product.title= title || product.title
            product.description= description || product.description
            product.image= image || product.image
            product.price= price || product.price
            product.category= category || product.category
            product.countInStock= countInStock || product.countInStock

            const updateProduct = await product.save();
            res.status(200).json({message:"Product Updated"})
        }
        else {
            res.status(404).json({message:"Product not Found"})
        }
    } 
    catch (error) {
         console.error(error);
        res.status(500).json({ message: 'Server error' });
        
    }
}
export const deleteProduct = async (req: Request, res: Response) => {
    try {
        const product = await Products.findById(req.params.id);

        if (product) {
            await product.deleteOne(); // Use deleteOne() on the document instance
            res.status(200).json({ message: 'Product removed' });
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};