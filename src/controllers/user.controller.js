import { asyncHandler } from "../utils/asynchandler.js"
import {ApiError} from "../utils/ApiError.js";
import {User} from "../models/user.models.js"
import {uploadOnCloudinary} from "../utils/cloudinary..service.js"
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler( async (req,res)=>{

    //HOW TO REGISTER THE USER
    //get the user details from frontend
    //validate the user details - not empty
    //check if user already exists or not- username or email
    //check for images, check for avatar
    //upload them to cloudinary,avatar
    //create the user onject- create entry in db
    //remove password and refresh token field from response 
    //check for user creation
    //return response


        const {name,fullname,email,password,userName}=req.body   //req.body ke andar data aa rha hai
        console.log(name,email,password,fullname);

        //method 1
        // if(fullname === ""){
        //     throw new ApiError(400,"fullname is required")
        // }

        //method 2
        if(
            [name,fullname,email,password,userName].some((field) => field?.trim() === "")
        ){
            throw new ApiError(400,"all fields are required");
        }

        
       const existedUser = User.findOne({
            $or : [{ userName } , { email }]
        })

        if(existedUser){
            throw new ApiError(409, "User with email or username already exists" ) ; 
        }

        const avatarLocalPath = req.files?.avatar[0].path?;
        const coverImageLocalPath = req.files?.coverImage[0]?.path;

        if(!avatarLocalPath){
            throw new error(400, "Avatar file is required")
        }

        const avatar = await uploadOnCloudinary(avatarLocalPath);
        const coverImage = await uploadOnCloudinary(coverImageLocalPath)

        if(!avatar){
            throw new ApiError(400,"Avatar field is required")
        }

        const user = await User.create({
            fullname,
            avatar :avatar.url,
            coverImage:coverImage?.url || "",
            email,
            password,
            fullname : fullname.toLowerCase()
        })

        const createdUser = await User.findById(user._id).select(
            "-password -refreshToken"
        )

        if(!createdUser){
            throw new ApiError(500,"something went wrong while registering the error")
        }

        return res.status(201).json(
            new ApiResponse(200,createdUser," user registered successfully")
        )

} )



export {
    registerUser,
}