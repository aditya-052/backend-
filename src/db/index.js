import mongoose  from "mongoose";
import {  DB_NAME} from "../constants.js"

const connectDB = ( async ()=>{
    try {
      const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)

      console.log(`\n MONGODB CONNECTED !!\n connection instance :${connectionInstance} !!\n DB HOST : ${connectionInstance.connection.host}`)
        
    } catch (error) {
        console.log("Mongo DB connection error ",error)
        process.exit(1)
    }

})

export default connectDB