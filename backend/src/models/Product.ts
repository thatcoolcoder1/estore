import mongoose, {Schema,Document} from "mongoose";
import { Product } from "../Interface.js";


export interface ProductModel extends Product,Document {}

const ProductSchema = new Schema<ProductModel>({
    title:{
        type: String,
        required:true,
        trim:true

    },
    image : {
        type : [String],
        required:true,
    },
    description:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    category:{
        type:String,
        required:true
    },
    countInStock:{
        type:Number,
        required:true
    }
},{timestamps:true,

})

const Products = mongoose.model<ProductModel>("Products",ProductSchema)
export default Products;