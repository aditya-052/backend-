// require('dotenv').config();

import dotenv from 'dotenv'
import connectDB from './db/index.js'
import {app} from './App.js'

dotenv.config({
    path:"./env"
})

connectDB()
.then(()=>{
    app.listen(process.env.PORT||4000 ,()=>{
        console.log(`Server is listening at port :${process.env.PORT}`)
    })
})
.catch((err)=>{
    console.log("mongodb connection failed ", err)
})













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