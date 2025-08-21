import { Router } from "express";
import { createOrder,verifyPayments } from "../controllers/paymentControllers.js";
import {protect} from "../middleware/authMiddleware.js"

const router = Router();

router.post("/create-order",protect,createOrder)
router.post("/verify",verifyPayments)


export default router;