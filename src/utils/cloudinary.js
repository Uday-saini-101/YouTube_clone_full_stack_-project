import {v2 as cluodinary } from "cloudinary"
import { response } from "express";
import fs from "fs"
import { resourceLimits } from "worker_threads";

cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
        api_key: process.env.CLOUDINARY_API_KEY, 
        api_secret: process.env.CLOUDINARY_API_SECRET // Click 'View API Keys' above to copy your API secret
    });

   const Uploadcloudinary = async (LocalFilePath) => {
   try {
      if(!LocalFilePath) return null

    const responce = await cloudinary.uploader.upload
    (LocalFilePath , {resource_type: "auto"})
      
   console.log("file is sucessfully uploaded on cloudinary", response.url);
   return responce ;
   }
   catch (error)
   {
    fs.unlinkSync(LocalFilePath) // remove the file in local storage
    return null
   }
  }
export default Uploadcloudinary