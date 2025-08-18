import { Document, Types } from 'mongoose';

export interface IOrderItem {
    product: Types.ObjectId;
    title: string;
    image: string[];
    price: number;
    quantity: number;
}

export interface IOrder {
    user: Types.ObjectId;
    items: IOrderItem[];
    totalPrice: number;
    
    // Recommended fields for order status and shipping
    shippingAddress: {
        address: string;
        city: string;
        postalCode: string;
        country: string;
    };
    paymentMethod: string;
    isPaid: boolean;
    paidAt?: Date; // Optional, as it will be set after payment
    isDelivered: boolean;
    deliveredAt?: Date; // Optional, as it will be set after delivery
    status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
}

export interface IOrderModel extends IOrder, Document {}
