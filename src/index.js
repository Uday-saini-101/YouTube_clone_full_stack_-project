import dotenv from 'dotenv'
import connectDB from './db/index.js'
import express from "express"
import userRouter from "./routes/user.route.js"
import { app } from "./app.js"


// const app = express();

dotenv.config({ path: './.env' });

connectDB()
.then(() => {
    app.on("error",(error)=>{
        console.log(`connection is failed ${error}`)
        throw error
    })
    app.use("", userRouter)
    app.get("/",(req,res)=>{
        res.send("Hello World!")
    })
    app.listen(process.env.PORT || 2005, () => {
        console.log(`server is running at ${process.env.PORT}`);
    })
})
.catch((error) => {
    console.log(`mongose connection is failed due to ${error} `);
})






/*
import express from 'express';

const app = express();

( async() => {
  try {
    await mongoose.connect(`${process.env.MONGO_URL}/${DB_NAME}`) 
    app.on("error",(error)=>{
      console.error("Error connecting to MongoDB:", error)
      throw error
    })

    app.listen(process.env.PORT, () => {
      console.log(`Server is running on port ${process.env.PORT}`);
    })
  }
  catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw error
  }
})()
  */
     