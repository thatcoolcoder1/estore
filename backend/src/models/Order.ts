import mongoose, { Schema } from 'mongoose';
import { IOrderModel, IOrderItem } from '../Interface.js'; // Importing the Order and OrderItem interfaces


// Define the sub-schema for a single item within an order
const OrderItemSchema = new Schema<IOrderItem>({
    product: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Product', // Reference to the Product model
    },
    title: {
        type: String,
        required: true,
    },
    image: {
        type: [String], // An array of image URLs
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
});

// Define the main schema for the Order model
const OrderSchema = new Schema<IOrderModel>({
    user: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User', // Reference to the User model
    },
    items: [OrderItemSchema], // Use the OrderItemSchema as a sub-document array
    totalPrice: {
        type: Number,
        required: true,
        default: 0,
    },
    shippingAddress: {
        address: { type: String, required: true },
        city: { type: String, required: true },
        postalCode: { type: String, required: true },
        country: { type: String, required: true },
    },
    paymentMethod: {
        type: String,
        required: true,
    },
    isPaid: {
        type: Boolean,
        required: true,
        default: false,
    },
    paidAt: {
        type: Date,
    },
    isDelivered: {
        type: Boolean,
        required: true,
        default: false,
    },
    deliveredAt: {
        type: Date,
    },
    status: {
        type: String,
        required: true,
        default: 'pending',
    },
}, {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
});

// Create and export the Order model
const Order = mongoose.model<IOrderModel>('Order', OrderSchema);
export default Order;
