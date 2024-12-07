import { token } from 'morgan';
import userModel from '../models/userModel.js' 
import cloudinary from "cloudinary";
import { getDataUri } from '../utils/features.js';

export const registerController=async(req,res)=>{
    try{
      const {name , email, password , address , city, country,phone}=req.body;

      //validation
      if(!name || !email || !password || !address || !city || !country || !phone){
        return res.status(500).send({
            succes:false,
            message:"Please Provide All Fields",
        });
      }

      //check existing user
      const existingUser=await userModel.findOne({email});
      //validation
      if(existingUser){
        return res.status(500).send({
            succes:false,
            message:"email already taken",
        });
      }
        const user=await userModel.create({name , email, password , address , city, country,phone});
        res.status(201).send({
            succes:true,
            message:"Registeration Successful,please login",
            user,
        })
    }
    //error found in try is handleled by catch
    catch(error){
        console.log(error);
        res.status(500).send({
            success:false,
            message:"Error in Register API",
            error,
        });

    }
};

//LOGIN
export const loginContoller= async(req,res) =>{
    try{
       const{email,password}=req.body;

       //validation 
       if(!email || !password ){
        return res.status(500).send({
            succes:false,
            message:'Please Add email or password'
        })
       }
       
       //check user exist
       const user=await userModel.findOne({email})
       if(!user){
        return res.status(404).send({
            succes:false,
            message:'User Not Found'
        })
       }

       //check password exist
       const isMatch= await user.comparePassword(password);

       //validation password
       if(!isMatch){
        return res.status(500).send({
            succes:false,
            message:"invalid credentials",
        })
       }
       const token=user.generateToken();

       res.status(200).cookie("token",token,{
        expires:new Date(Date.now()+ 15*24*60*60*1000),
        secure :process.env.NODE_ENV==="development"? true:false,
        httpOnly :process.env.NODE_ENV==="development"? true:false,
        sameSite   :process.env.NODE_ENV==="development"? true:false,



       })
       .send({
        success:true,
        message:"Login Successfully",
        token,
        user,
       });
    }
    catch(error){
        console.log(error)
        res.status(500).send({
            succes:'false',
            message:'Error in Login App',
            error
        })
    }
};

//GET USER PROFILE
export const getUserProfileController= async(req,res)=>{
    try{
        const user=await userModel.findById(req.user._id);
        user.password=undefined;
        res.status(200).send({
            success:true,
            message:"User Profile Fetched Successfully",
            user
        });
    }

    catch(error){
        console.log(error)
        res.status(500).send({
            success:false,
            message:'Error In Profile API',
            error,
        })
    }
};

//LOGOUT
export const logoutController = async(req,res)=>{
    try{
        res.status(200).cookie("token","",{
        expires:new Date(Date.now()),
        secure :process.env.NODE_ENV==="development"? true:false,
        httpOnly :process.env.NODE_ENV==="development"? true:false,
        sameSite   :process.env.NODE_ENV==="development"? true:false,
        })
        .send({
            success:true,
            message:"Logout Successfully"
        })
    }

    catch(error){
        console.log(error)
        res.status(500).send({
            success:false,
            message:'Error In Logout API',
            error,
        })

    }
}

//UPDATE
export const updateProfileController=async(req,res)=>{
    try{
        const user=await userModel.findById(req.user._id)
        const {name,email,address,city,country,phone}=req.body

        //validation + update
        if(name)user.name=name
        if(email)user.email=email
        if(address)user.address=address
        if(city)user.city=city
        if(country)user.country=country
        if(phone)user.phone=phone;
        //save user
        await user.save();
        res.status(200).send({
            success:true,
            message:"User Profile Updated",
        });
    
    }
    catch(error){
        console.log(error)
        res.status(500).send({
            success:false,
            message:'Error In update profile API',
            error,
        })
    }
};

//update password
export const updatePasswordController=async(req,res)=>{
    try{
        const user=await userModel.findById(req.user._id)
        const {oldPassword,newPassword}=req.body

        //validation
        if(!oldPassword || !newPassword){
            return res.status(500).send({
                success:false,
                message:'Please provide old or new password'
            })
        }

        //old pass check
        const isMatch=await user.comparePassword(oldPassword)

        //validation
        if(!isMatch){
            return res.status(500).send({
                success:false,
                message:"Invalid Old Password"
            })
        }

        user.password = newPassword;
        await user.save()
        res.status(200).send({
            success : true,
            message:"Password Updated Successfully"
        })
    }

    catch(error){
        console.log(error)
        res.status(500).send({
            success:false,
            message:'Error In update password API',
            error,
        })
    
    }
}

//Update user profile phooto
export const updateProfilePicController=async(req,res)=>{
    try{
        const user=await userModel.findById(req.user._id)

        //file get from client photo
        const file=getDataUri(req.file)

        //delete prev img
        await cloudinary.v2.uploader.destroy(user.profilePic.public_id)

        //update
        const cdb=await cloudinary.v2.uploader.upload(file.content)
        user.profilePic={
            public_id:cdb.public_id,
            url:cdb.secure_url
        };

        await user.save();

        res.status(200).send({
            success : true,
            message:"Profile picture Updated "
        })

    }

    catch(error){
        console.log(error)
        res.status(500).send({
            success:false,
            message:'Error In update password API',
            error,
        });    

    }
}