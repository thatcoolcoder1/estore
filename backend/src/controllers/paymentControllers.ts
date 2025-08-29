import type { Request, Response } from "express";
import Razorpay from "razorpay";
import crypto from "crypto";
import Order from "../models/Order.js";
import dotenv from "dotenv";

dotenv.config({ path: ".env" });

const razorpay = new Razorpay({
  key_id: process.env.key_id,
  key_secret: process.env.key_secret,
});

export const createOrder = async (req: Request, res: Response) => {
  try {
    const { amount, receipt, currency = "INR" } = req.body;
    const options = {
      amount: amount * 100,
      currency,
      receipt,
    };
    const order = await razorpay.orders.create(options);
    res.status(201).json({
      id: order.id,
      currency: order.currency,
      amount: order.amount,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};



export const verifyPayments = async (req: Request, res: Response) => {
  try {
    const { orderId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!orderId || !razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ status: "failure", message: "Missing required fields" });
    }

    // 1️⃣ Verify Razorpay signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.key_secret as string)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ status: "failure", message: "Invalid signature" });
    }

    // 2️⃣ Find the local order by its _id
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ status: "failure", message: "Order not found" });
    }

    // 3️⃣ Update order as paid
    order.isPaid = true;
    order.paidAt = new Date();
    order.status = "processing";
    // order.razorpayPaymentId = razorpay_payment_id;

    await order.save();

    return res.status(200).json({
      status: "success",
      message: "Payment verified and order updated successfully",
    });
  } catch (error) {
    console.error("Payment verification error:", error);
    return res.status(500).json({ status: "failure", message: "Server error" });
  }
};


