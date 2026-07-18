import { asyncHandler } from "../utils/asyncHandler.js" 
import { ApiError } from "../utils/apiError.js"
import { User } from "../models/user.model.js"
import { Uploadcloudinary } from "../utils/cloudinary.js"
import { ApiResponce } from "../utils/apiResponce.js"

const generateAccesTokenOrRefershToken = async (userId) => {

try {

  const user = await User.findById(userId)
  const accessToken = user.generateAccessToken()
  const refreshToken =  user.generateRefccessToken()

  // sava refersh token data base
  user.refreshToken = refreshToken
  await user.save({valideteBeforeSave: false})

  return { refreshToken , accessToken}

}catch(error){
  throw new ApiError(500 , "someting went wrong in generating access or refersh token ")
}

}

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
  // const coverImageLocalPath = req.files?.coverImage?.[0]?.path;

  // classic method of javascript
   let coverImageLocalPath ;
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0)
   {
    coverImageLocalPath = req.files.coverImage[0].path
   }
   
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
  new ApiResponce(200 , createUser , "User create successfully"),
  console.log("User create successfully")
)

})

const loginuser = asyncHandler (async (req , res) => {

  const { username , email , password} = req.body 

  // check username or email have or not 
  if( !username || !email) {
    throw new ApiError (" 400 , username or email one ust be rerqired ")
  }

  const user = await User.findOne({
    $or: [{username}, {email}]
  })

  // check username or email have or not 
  if( !user) {
    throw new ApiError ( 401 ," user does not exist ")
  }

  //  check password is correct or not 
  const isPasswordVaild = user.isPasswordCorrect(password)

  if( !isPasswordVaild) {
    throw new ApiError ( 402 ," password is incorrect  ")
  } 

 const { refreshToken , accessToken } = await generateAccesTokenOrRefershToken(user._id)

 const loggedInUser = await  User.findById(user._id).select( " -password -refreshToken ")

 const option = {
  httpOnly: true ,
  secure: true
 }

 return res.status(200)
 .cookie("accessToken",accessToken,option)
 .cookie("refreshToken",refreshToken,option)
 .json(
    new ApiResponce(
      200,
      {user: loggedInUser , accessToken , refreshToken },
      "user logged successfully"
    )
  )

})

const logOutUser = asyncHandler ( async (req, res) => {

  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set : {
        refreshToken : undefined,
      }
    },
   {
    new : true
   }
  )
  const option = {
  httpOnly: true ,
  secure: true
 }

 return res.status(200)
 .ClearCookie("accessToken",option)
 .ClearCookie("refreshToken",option)
 .json(
    new ApiResponce(
      200,
      {},
      "user logOut successfully"
    )
  )

})
export { registerUser , loginuser , logOutUser }