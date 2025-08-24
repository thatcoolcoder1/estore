import mongoose, { Schema } from 'mongoose';
import { CartModel } from '../Interface.js';

// The Mongoose schema for the cart
const CartSchema = new Schema<CartModel>({
    user: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User', // ref creates a relationship to the User model
    },
    items: [
        {
            product: {
                type: Schema.Types.ObjectId,
                required: true,
                ref: 'Product', // ref creates a relationship to the Product model
            },
            title: {
                type: String,
                required: true,
            },
            image: {
                type: [String],
                required: true,
            },
            price: {
                type: Number,   
                required: true,
            },
            quantity: {
                type: Number,
                required: true,
            },
        },
    ],
    totalPrice: {
        type: Number,
        required: true,
        default: 0,
    },
});


const Cart = mongoose.model<CartModel>('Cart', CartSchema);
export default Cart;