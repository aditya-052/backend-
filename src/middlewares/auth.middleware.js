//it verifies user exists or not
import {asyncHandler} from "../utils/asynchandler.js"
import jwt from "jsonwebtoken"
import {User} from "../models/user.models.js" 

export const verifyJWT = asyncHandler(async(req, res , next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","")
    
        if(!token){
            throw new ApiError(401,"unauthorized request")
        }
    
        const decodedToken = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
    
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken")
    
        if(!user){
            // NEXT_VIDEO: DISCUSS ABOUTFRONTEND
            throw new ApiError(401,"Invalid Access Token")
        }
    
        req.user=user;
        next()

    } catch (error) {
        throw new ApiError(401,error?.message || "invalid access token")
    }
})