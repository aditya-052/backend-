import { asyncHandler } from "../utils/asynchandler.js"

const registerUser = asyncHandler( async (req,res)=>{
    console.log("ok")
     res.status(200).json({
        message:"chai aur code i am aditya"
    })
})

export {
    registerUser,
}