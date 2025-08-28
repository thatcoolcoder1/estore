import { Router } from "express";
import { protect, admin } from "../middleware/authMiddleware.ts"
import { getAdminOrders, updateOrderToDelivered, updateOrderToPaid, getOrderById, getOrders, createOrder } from "../controllers/orderControllers.ts"

const router = Router();

router.get("/", protect, getOrders)
router.get("/:id", protect, getOrderById)
router.post("/create-order", protect, createOrder)
router.get("/admin", protect, admin, getAdminOrders)
router.post("/:id/delivered", protect, admin, updateOrderToDelivered)
router.post("/:id/pay", protect, admin, updateOrderToPaid)

export default router;

