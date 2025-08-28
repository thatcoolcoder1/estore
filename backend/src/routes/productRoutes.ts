
import { Router, Request, Response } from "express";
import { protect, admin } from "../middleware/authMiddleware.js";
import {
  getProductById,
  getProductByCategory,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productControllers.js";
import Products from "../models/Product.js";

const router = Router();

// Public Routes - Accessible by everyone
router.get("/category/:category", getProductByCategory);
// Place the more specific search route before the more generic ID route
router.get("/search", async (req: Request, res: Response) => {
  const { query } = req.query;
  if (!query) return res.status(400).json({ message: "Query is required" });

  try {
    const products = await Products.find({
      title: { $regex: query, $options: "i" }, // case-insensitive match
    });
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});
router.get("/:id", getProductById);

// Admin Routes - Accessible only by authenticated admins
router.post("/", protect, admin, createProduct);
router.put("/:id", protect, admin, updateProduct);
router.delete("/:id", protect, admin, deleteProduct);

export default router;

