import { asyncHandler } from "../utils/asyncHandler.js" 
import { ApiError } from "../utils/apiError.js"
import { User } from "../models/user.model.js"
import { Uploadcloudinary } from "../utils/cloudinary.js"
import { ApiResponce } from "../utils/apiResponce.js"

const registerUser = asyncHandler(async (req,res ) =>{
  // get data from user side and image upload in cloudinary
  const {fullName, username ,email , password , number }=req.body
  console.log("fullname :",fullName,
               "username",username,
              "email :",email,
              "password :",password,
              "number :",number
  );
  // check some required things/vaildetion

  if(
    [fullName , email , password ].some((field)=>
    field?.trim() === "")
  ){
    throw new ApiError(400 , "email must required")
  }

  // easy way
  // if(email === "")
  // {
  //   throw new ApiError(400 , "email must required")
  // }

 // check user already exist or not 
  const existingUser = await User.findOne({
    $or :[{ username },{ email }]
  })
  if(existingUser) {
    throw new ApiError(409,"user already existed try uniqe email & username")
  }

  //check avater or coverImage 
  const avatarLocalPath = req.files?.avatar?.[0]?.path;
  const coverImageLocalPath = req.files?.coverImage?.[0]?.path;
   
  // console.log("req.file:", req.file);
  // console.log("req.files:", req.files);
  // console.log("Avatar Path:", avatarLocalPath);

  if(!avatarLocalPath){
    throw new ApiError (400 , "avatar file is not uploaded 1" )
  }
 

  //upload on cloudinary
  const avatar = await Uploadcloudinary(avatarLocalPath)
  const coverImage = await Uploadcloudinary(coverImageLocalPath)

  if(!avatar){
    throw new ApiError (400 , "avatar file is not uploaded 2" )
  }

  // upload the data on mongose database
  const user = await User.create({
    fullName,
    avatar : avatar.url,
    coverImage : coverImage?.url || "",
    email,
    password,
    username : username.toLowerCase()
  })

  // remove password and refreshToken from responce
  const createUser = await User.findById(user._id).select(
    "-password -refreshToken"
  )
  if(!createUser){
    throw new ApiError(500 , "Someting went wrong while register the user")
  }
 
  // return responce
return res.status(201).json(
  new ApiResponce(200 , createUser , "User create successfully")
)

})
export { registerUser }