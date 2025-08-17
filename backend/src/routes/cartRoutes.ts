import {getCart,addItem,deleteItem,clearCart,updateItemQuantity} from "../controllers/cartControllers.js"
import { Router } from "express"
import {protect} from "../middleware/authMiddleware.js"


const router = Router();

router.get("/",protect,getCart)
router.post("/",protect,addItem)
router.delete("/item",protect,deleteItem)
router.delete("/",protect,clearCart)
router.put("/",protect,updateItemQuantity)

export default router