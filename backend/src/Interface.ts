import {Document,Types} from "mongoose"




export interface IUser{
        name:string,
        email:string,
        password:string,
        image?: string,
        isAdmin:boolean
    

    }

export interface Product{
    title:string,
    description:string,
    image?:string[],
    price:number,
    category:string,
    countInStock:number

}

export interface CartItem{
    product:Types.ObjectId;
    title:string,
    image:string[],
    price:number,
    quantity:number
}

export interface Cart{
    user:Types.ObjectId,
    items:CartItem[],
    totalPrice:number
}



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


export interface CartModel extends Cart, Document{}
