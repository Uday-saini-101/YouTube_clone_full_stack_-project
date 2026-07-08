import { Router } from "express";
import regesterUser from "../controllers/user.controller";

const router = Router()

router.route("/register").post(regesterUser)


export default router