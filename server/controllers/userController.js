import { User as userModel } from '../models/userModel.js' 

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
        succes:true,
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