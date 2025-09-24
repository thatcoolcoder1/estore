import { Router } from "express";
import { protect, admin } from "../middleware/authMiddleware.js"
import { getAdminOrders, updateOrderToDelivered, updateOrderToPaid, getOrderById, getOrders, createOrder } from "../controllers/orderControllers.js"

const router = Router();

router.get("/", protect, getOrders)
router.post("/create-order", protect, createOrder)
router.get("/", protect, admin, getAdminOrders)
router.get("/:id", protect, getOrderById)
router.post("/:id/delivered", protect, admin, updateOrderToDelivered)
router.post("/:id/pay", protect, admin, updateOrderToPaid)

export default router;

