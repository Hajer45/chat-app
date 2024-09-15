import bycryptjs from "bcryptjs"
import User from "../models/user.model.js"
import generateTokenAndSetCookie from "../utils/generateToken.js"

export const signup = async(req, res) => {
    try{
        const {fullName,username,password,confirmPassword,gender}=req.body
        if(password != confirmPassword){
            return res.status(400).json({error:"Password does not match"})
        }
        const user = await User.findOne({username})
        if(user){
            console.log(user)

            return res.status(400).json({error:"User already exists"})
        }

        const salt = await bycryptjs.genSalt(10)
        const hashPassword = await bycryptjs.hash(password,salt)
        const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`
        const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`
        const newUser = new User({
            fullName,
            username,
            password:hashPassword,
            gender,
            profilePic:gender == "male"?boyProfilePic:girlProfilePic
        })
        if(newUser){
            //generate jwt token 
            generateTokenAndSetCookie(newUser._id,res)
            await newUser.save()

            return res.status(201).json({
                _id:newUser._id,
                fullName:newUser.fullName,
                username:newUser.username,
                gender:newUser.gender,
                profilePic:newUser.profilePic
            })
        }
        else
        {
            return res.status(400).json({error:"invalid user data "})
        }
       

    }
    catch(err){
        console.log("error in signup controller",err.message)
        res.status(500).json({error:"internal server error"})
    }
   
}
export const login = async(req, res) => {
    try{
        const {username,password}=req.body;

        const user = await User.findOne({username})
        const isPasswordValid = await bycryptjs.compare(password,user?.password || "")
        if(!user || !isPasswordValid){
            return res.status(400).json({error:"Invalid username or password"})
        }

        //generate jwt token
        generateTokenAndSetCookie(user._id,res)
        res.status(200).json({
            _id:user._id,
            fullName:user.fullName,
            username:user.username,
            profilePic:user.profilePic
        })
    }
    catch(err){
        console.log("error in login controller",err.message)
        res.status(500).json({error:"internal server error"})
    }
  
}
export const logout = (req, res) => {
    try {
        res.cookie("jwt","",{maxAge:0})
        res.status(200).json({message:"user logged out successfully"})
        
    } catch (err) {
        console.log("error in logout controller",err.message)
        res.status(500).json({error:"internal server error"})
    }
}