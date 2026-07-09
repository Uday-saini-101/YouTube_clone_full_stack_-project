import { asyncHandler } from "../utils/asyncHandler.js" 

const regesterUser = asyncHandler( async (req,res) => {
  res.status(200).json({
    success: true,
    message: "user is regestered successfully"
  })
})

export { regesterUser }