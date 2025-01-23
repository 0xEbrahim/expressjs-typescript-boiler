import express from 'express'
const router = express.Router()
import {login, logout, refresh, signup} from "../controllers/authController"


router.post("/login", login)
router.post("/logout", logout)
router.post("/signup", signup)
router.get("/refresh", refresh)
export const authRouter = router