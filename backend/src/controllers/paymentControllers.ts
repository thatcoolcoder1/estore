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
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const body = `${razorpay_order_id}|${razorpay_payment_id}`;
    const generated_signature = crypto
      .createHmac("sha256", process.env.webhook_secret as string) // ✅ use key_secret
      .update(body)
      .digest("hex");
    console.log(generated_signature)

    if (generated_signature === razorpay_signature) {
      // find your local order by razorpay_order_id (not Mongo _id!)
      const order = await Order.findOne({ razorpayOrderId: razorpay_order_id });
      if (order) {
        order.isPaid = true;
        order.paidAt = new Date();
        order.status = "processing";
        await order.save();
      }

      return res.status(200).json({
        status: "success",
        message: "Payment verified successfully",
      });
    } else {
      return res.status(400).json({
        status: "failure",
        message: "Invalid signature",
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

