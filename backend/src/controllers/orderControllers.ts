import type {Request, Response} from "express";
import  Order from "../models/Order.js" 
import Cart from "../models/Cart.js"
import Products from "../models/Product.js"




export const createOrder = async (req: Request, res: Response) => {
    // Check for authenticated user
    if (!req.user) {
        return res.status(401).json({ message: "User not authenticated" });
    }

    const userId = req.user._id;
    const { shippingAddress, paymentMethod } = req.body;

    try {
        const cart = await Cart.findOne({ user: userId });

        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ message: "Cart is empty." });
        }
        
        // Retrieve products from the cart to create an order snapshot
        const orderItems = cart.items.map(item => ({
            product: item.product,
            title: item.title,
            image: item.image,
            price: item.price,
            quantity: item.quantity,
        }));

        // Create the new order document
        const newOrder = new Order({
            user: userId,
            items: orderItems,
            totalPrice: cart.totalPrice,
            shippingAddress: shippingAddress,
            paymentMethod: paymentMethod,
            isPaid: false,
            isDelivered: false,
            status: "pending",
        });

        // Save the order to the database
        const createdOrder = await newOrder.save();

        // Clear the user's cart after a successful order
        cart.items = [];
        cart.totalPrice = 0;
        await cart.save();
        
        res.status(201).json(createdOrder);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error during order creation." });
    }
};

// @desc    Get all orders for the authenticated user
// @route   GET /api/orders
// @access  Private
export const getOrders = async(req: Request, res: Response) => {
    if (!req.user) {
        return res.status(401).json({ message: "User not authenticated" });
    }

    try {
        // Use req.user._id to find all orders for the authenticated user
        const orders = await Order.find({ user: req.user._id });

        if (orders.length === 0) {
            return res.status(404).json({ message: "No orders found." });
        }

        // Return a 200 status with all the found orders
        res.status(200).json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error." });
    }
};

// @desc    Get a single order by ID for the authenticated user
// @route   GET /api/orders/:id
// @access  Private
export const getOrderById = async(req: Request, res: Response) => {
    if (!req.user) {
        return res.status(401).json({ message: "User not authenticated" });
    }
    
    const orderID = req.params.id;

    try {
        // Find the specific order that matches the order ID and belongs to the user
        const order = await Order.findOne({ _id: orderID, user: req.user._id });

        if (!order) {
            return res.status(404).json({ message: "Order not found." });
        }
        
        // Return a 200 status with the found order
        res.status(200).json(order);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error." });
    }
};

// @desc    Update an order to paid status
// @route   PUT /api/orders/:id/pay
// @access  Private/Admin
export const updateOrderToPaid = async (req: Request, res: Response) => {
   
    

    try {
        const orderId = req.params.id;
        const order = await Order.findById(orderId);

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        if (order.isPaid) {
            return res.status(400).json({ message: "Order is already paid" });
        }

        // Update the order fields
        order.isPaid = true;
        order.paidAt = new Date();
        order.status = "processing"; // Update the status after payment

        const updatedOrder = await order.save();
        res.status(200).json(updatedOrder);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error during payment update." });
    }
};

export const updateOrderToDelivered = async(req:Request,res:Response) =>{
  

  try {
    const orderID = req.params.id;
    const order = await Order.findById(orderID);
    if(!order){
      return res.status(404).json({message:"Order Not Found"})
    }

    if (order.isDelivered){
      return res.status(400).json({message:"Order is already delivered"})
    }

    order.isDelivered = true;
    order.deliveredAt = new Date();
    order.status = "delivered"

    const updatedOrder = await order.save();
    res.status(200).json(updatedOrder)
  }
  catch(error){
    console.log(error)
    res.status(500).json({message:"Server Error"})
  }
}

export const getAdminOrders = async (req: Request, res: Response) => {
  try {
    const orders = await Order.find({});

    if (orders.length === 0) {
      return res.status(404).json({ message: "No orders found." });
    }

    res.status(200).json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error." });
  }
};

