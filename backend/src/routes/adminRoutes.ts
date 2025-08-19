import {admin,protect} from "../middleware/authMiddleware.js"
import {getUsers,updateUser,getUsersById,deleteUser} from "../controllers/adminControllers.js"
import {Router} from "express"


const router = Router();

//Get Routes
router.get("/",protect,admin,getUsers);
router.get("/:id",protect,admin,getUsersById)

router.put("/:id",protect,admin,updateUser)
router.delete("/:id",protect,admin,deleteUser)

export default router;
