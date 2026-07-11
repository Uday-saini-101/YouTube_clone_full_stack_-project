import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js"
import { upload } from "../middlewares/multer.middlerware.js"

const router = Router()

router.route("/register").post(
  // use middleware for uploading image to cloudinary server side 
  upload.fields(
    {
      name : "avatar",
      maxCount:1
      
    },
    {
      name : "coverImage",
      maxCount:1
    }
  ),
  registerUser)


export default router