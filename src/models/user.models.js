import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
      trim: true,
      index: true, //if want to make any field searchable then make its index true in the data modelling
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
      trim: true,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
      index: true, //if want to make any field searchable then make its index true in the data modelling
    },
    avatar: {
      type: String, //cloudinary url
      required: true,
    },
    coverImage: {
      type: String, //clodinary url
    },
    watchHistory: 
    [
        {
            type: Schema.Types.ObjectId,
            ref: "Video",
        }
    ],
    password:{
        type : String,
        required:[true,"Password is required "]
    },
    refreshToken:{
        type:String
    }
  },
  {
    timestamps:true
  }
);

userSchema.pre("save",async function (next) {
  if(this.isModified("password")){
    this.password=bcrypt.hash(this.password,10)
  }
  next()
})

userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password,this.password)
}

userSchema.methods.generateAccesstoken=function(){
  return jwt.sign(
    {
        _id:this._id,
        email:this.email,
        username:this.username,
        fullName:this.fullName
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY
    }
  )
}
userSchema.methods.generateRefresjtoken=function(){
  return jwt.sign(
    {
        _id:this._id,
        
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY
    }
  )
}

export const User = mongoose.model("User", userSchema);
