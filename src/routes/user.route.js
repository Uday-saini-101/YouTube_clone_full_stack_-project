import { Router } from "express";
import { loginuser, logOutUser, registerUser } from "../controllers/user.controller.js"
import { upload } from "../middlewares/multer.middlerware.js"
import {validJwtToken} from "../middlewares/auth.middleware.js"

const router = Router()

router.route("/register").post(
  // use middleware for uploading image to cloudinary server side 
  upload.fields([
    {
      name : "avatar",
      maxCount : 1
      
    },
    {
      name : "coverImage",
      maxCount : 1
    }
  ]),
  registerUser)

router.route("/login").post(loginuser)

router.route("/logout").post( validJwtToken ,logOutUser)

export default router