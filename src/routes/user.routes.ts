import express from "express";
import {createUser, deleteUser, getAllUsers, updateUser, getUser} from "../controllers/userController";
import { protect } from "../controllers/authController";
const router = express.Router();

router.post("/",createUser)
router.get("/", protect, getAllUsers)
router.get("/:id", protect,getUser)
router.delete("/:id",protect,deleteUser)
router.patch("/:id",protect, updateUser)

export const userRouter = router;