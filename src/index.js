// require('dotenv').config();

import dotenv from 'dotenv'
import connectDB from './db/index.js'

dotenv.config({
    path:"./env"
})

connectDB()













//Method 1
// function connectDB(){

// }

// connectDB()


/*

import express from 'express'
const app=express()

//iffy approach
;( async ()=>{
    try{
        await  mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        app.on("error" ,(error)=>{
            console.log("ERRORrr",error);
            throw error
        })

        app.listen(process.env.PORT,()=>{
            console.log(`app is listening on port ${process.env.PORT}`)
        })
    }
    catch(error){
        console.log("Error:" ,error)
    }
})()

*/