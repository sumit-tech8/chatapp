import userModel from "../models/userModel.js";
import { comparePassword, hashPassword } from "./../helper/authHelper.js";
import JWT from 'jsonwebtoken';

export const registerController = async (req, res) => {
  try {
    const { name, email, password, phone, answer } = req.body;
    //validations
    if (!name) {
      return res.send({ message: "Name is Required" });
    }
    if (!email) {
      return res.send({ message: "Email is Required" });
    }
    if (!password) {
      return res.send({ message: "Password is Required" });
    }
    if (!phone) {
      return res.send({ message: "Phone no is Required" });
    }
    if (!answer) {
      return res.send({ message: "Answer is Required" });
    }
    //check user
    const exisitingUser = await userModel.findOne({ email });
    //exisiting user
    if (exisitingUser) {
      return res.status(200).send({
        success: false,
        message: "Already Register please login",
      });
    }
    //register user
    const hashedPassword = await hashPassword(password);
    //save
    const user = await new userModel({
      name,
      email,
      phone,
      password: hashedPassword,
      answer
    }).save();
    
    res.status(201).send({
      
      success: true,
      message: "User Register Successfully",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in Registeration",
      error,
    });
  }
};


//POST LOGIN
export const loginController = async (req,res) =>{
  try {
    const {email,password} = req.body
    //validation
    if(!email || !password){ 
      return res.status(404).send({
        success:false,
        message: 'Invalid email of password'
      })
    }
    //check user
    const user = await userModel.findOne({email})
    if(!user){
      return res.status(404).send({
        success:false,
        message: 'email is not registerd'
      })
    }
    const match = await comparePassword(password,user.password)
    if(!match){
      return res.status(404).send({
        success:false,
        message: 'Invalid password'
      })
    }
    //token
    const token = await JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });
    res.status(200).send({
      success:true,
      message: 'login successfully',
      user:{
        _id: user._id,
        name:user.name,
        email:user.email,
        phone:user.phone,
      },
      token,
         })
  } catch (error) {
    console.log(error)
    res.status(500).send({
      success:false, 
      message:'Error in login',
      error
    })
  }
};





export const setAvatarController = async (req, res, next) =>{
  try {
    const userId = req.params.id;
    const avatarImage = req.body.image;
    const userData = await userModel.findByIdAndUpdate(userId,{
      isAvatarImageset: true,
      avatarImage,
        });
        return res.json({isSet:userData.isAvatarImageset,
          image: userData.avatarImage});
  } catch (ex) {
    next(ex)
  }
}



export const getAllUsersController = async (req, res, next) =>{
  try {
    const users = await userModel.find({ _id: { $ne: req.params._id}}).select([
      "email",
      "name",
      "avatarImage",
      "_id",
    ]);
    return res.json(users)
    
  } catch (ex) {
    next(ex);
  }
}






