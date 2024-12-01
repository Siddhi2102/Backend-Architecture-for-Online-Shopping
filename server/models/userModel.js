import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import JWT from 'jsonwebtoken'

//NoSQL database can be changed at any time but not in MySQL data
const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:[true,'name is required']
    },
    email:{
        type:String,
        required:[true,'email is required'],
        unique:[true,'email already taken']
    },
    password:{
        type:String,
        required:[true,'password is required'],
        minLength:[6,'password length should be grater than 6 characters']
    },
    address:{
        type:String,
        required:[true,'address is required']
    },
    city:{
        type:String,
        required:[true,'city name is required']
    },
    country:{
        type:String,
        required:[true,'country name is required']
    },
    phone:{
        type:String,
        required:[true,'phone number is required']
    },
    profilePic:{
        type:String,
    }
},{timestamps:true});//provide timings when data is createed

//functions
//hash func
userSchema.pre('save',async function(){
    this.password=await bcrypt.hash(this.password,10);

})

//compare function
// a method is a custom function that you define on a schema and can call on documents (instances of the model). 
//These methods operate on individual documents, giving you the ability to perform actions related to that specific document.
userSchema.methods.comparePassword=async function (plainPassword){
    return await bcrypt.compare(plainPassword,this.password);
};

//JWT TOKEN
userSchema.methods.generateToken=function(){
    return JWT.sign({_id:this._id} , process.env.JWT_SECRET,{expiresIn:"7d"});
}

export const User=mongoose.model("Users",userSchema);