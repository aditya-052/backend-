import { asyncHandler } from "../utils/asynchandler.js"
import {ApiError} from "../utils/ApiError.js";
import { User} from "../models/user.models.js"
import {uploadOnCloudinary} from "../utils/cloudinary.service.js"
import { ApiResponse } from "../utils/ApiResponse.js";

const generateAccessAndRefreshToken= async(userId) => {

    try {
    const user = await User.findById(userId)
    const accessToken = user.generateAccesstoken()
    const refreshToken = user.generateRefresjtoken()

    user.refreshToken = refreshToken 
    // we have to save the refresh token into the database and user is present in the db as object so save the key and value of the refreshToken using the above method

    await user.save({validateBeforeSave : false })
    //after adding the refreshToken in the user object we have to make the changes save or permanent so use the method user.save  //validateBeforeSave means we know what we have done and db is not required to validate the changes done

    return {accessToken,refreshToken}


    } catch (error) {
        throw new ApiError(500,"Something went wrong on our side while generating the access and refresh token")
    }
}

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


        const {fullName,email,password,userName}=req.body  //req.body ke andar data aa rha hai
        console.log(email,password,fullName);

        //method 1
        // if(fullame === ""){
        //     throw new ApiError(400,"fullName is required")
        // }

        //method 2
        if(
            [fullName,email,password,userName].some((field) => field?.trim() === "")
        ){
            throw new ApiError(400,"all fields are required");
        }

        
       const existedUser = await User.findOne({
            $or : [{ userName } , { email }]
        })

        if(existedUser){
            throw new ApiError(409, "User with email or username already exists" ) ; 
        }

        const avatarLocalPath = req.files?.avatar[0]?.path ;
        console.log(req.files)

        // const coverImageLocalPath = req.files?.coverImage[0]?.path;
        let coverImageLocalPath;
        if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length>0){
            coverImageLocalPath = req.files.coverImage[0].path
        }

        if(!avatarLocalPath){
            throw new ApiError(400, "Avatar field is required")
        }

        const avatar = await uploadOnCloudinary(avatarLocalPath)
        const coverImage = await uploadOnCloudinary(coverImageLocalPath)

        if(!avatar){
            throw new ApiError(400, "Avatar field is required")
        }

        const user = await User.create({
            fullName,
            avatar :avatar.url,
            coverImage:coverImage?.url || "",
            email,
            password,
            userName : userName.toLowerCase()
        })

        const createdUser = await User.findById(user._id).select(
            "-password -refreshToken"
        )

        if(!createdUser){
            throw new ApiError(500,"something went wrong while registering the error")
        }

        return res.status(201).json(
            new ApiResponse(200,createdUser, " user registered successfully")
        )

} )


//Login to the User
const loginUser =asyncHandler(async (req,res) =>{
    //req body -> data
    //validate if the user with email or username exist in the database
    //if not found throw ApiError for the user not found
    //if user found check the password
    //generate access(short term) and refresh(long term) token
    //send cookie(secure) or responce

    const { userName , email , password }=req.body

    if(!userName || !email){
        throw new ApiError(400," Username or Email is required ")
    }

    const user = User.findOne({
        $or :[{userName},{email}]
    })

    if(!user){
        throw new ApiError(400,"user not found")
    }

    const isPasswordValid = await user.isPasswordCorrect(password)

    if(!isPasswordValid){
        throw new ApiError(401,"incorrect password || Invalid User Credentials")
    }

    const {accessToken,refreshToken} = await generateAccessAndRefreshToken(user._id)

    const loggedInUser =await user.findById(User._id).select("-password -refreshToken")

    const options={
        httpOnly:true,         //now can be managed only from the server and changes are not made from the frontEnd            
        secure:true                       
    }

        return res
        .status(200)
        .cookie("accessToken",accessToken,options)
        .cookie("refreshToken",refreshToken,options)
        .json(
            new ApiResponse(
                200,
                {
                    user : loggedInUser,accessToken,refreshToken
                    //me ek object bhejna chahta hu user , user ke andar kya kya bhejna chahta hun  loggedInUser,accessToken,refreshToken
                },
                "User is logged in Successfully"
            )
        )

      
})




export {
    registerUser,
    loginUser
}