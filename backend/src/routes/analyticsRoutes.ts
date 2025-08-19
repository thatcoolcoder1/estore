import {Router} from "express";
import {protect,admin} from "../middleware/authMiddleware.js"
import {getSalesSummary,getOrdersByDate,getTopSellingProducts,getMonthlyRevenue} from "../controllers/analyticsControllers.js"

const router = Router();

router.get('/salesSummary',protect,admin,getSalesSummary)
router.get('/ordersByDate',protect,admin,getOrdersByDate)
router.get('/topSellingProducts',protect,admin,getTopSellingProducts)
router.get('/monthlyRevenue', protect,admin,getMonthlyRevenue)

export default router;
