import {Router} from "express";
import {getProductByCategory,getProductById,createProduct,updateProduct,deleteProduct} from "../controllers/productControllers.js"
import {protect,admin } from "../middleware/authMiddleware.js"
const router = Router();

router.get("/category/:category", getProductByCategory);
router.get("/:id", getProductById);

// Admin Routes - Accessible only by authenticated admins
router.post("/", protect, admin, createProduct);
router.put("/:id", protect, admin, updateProduct);
router.delete("/:id", protect, admin, deleteProduct);

export default router;