const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken")
const fs =require('fs')
const path =require('path')
const {v4:uuid} = require("uuid")







const User = require("../models/userModel");
const HttpError = require("../models/errorModel");
const { error } = require("console");

//==================== REGISTER A USER =========POST :api/users/register
//UNPROTECTED

const registerUser = async (req, res, next) => {
    try {
        const { name, email, password, confirmPassword } = req.body;
        
        // Check if all fields are provided
        if (!name || !email || !password) {
            return next(new HttpError("Please enter all fields", 422));
        }

        // Convert email to lowercase
        const newEmail = email.toLowerCase();

        // Check if email already exists
        const emailExists = await User.findOne({ email: newEmail });
        if (emailExists) {
            return next(new HttpError("Email already exists", 409));
        }

        // Validate password length
        if (password.trim().length < 6) {
            return next(new HttpError("Password must be at least 6 characters", 422));
        }

        // Check if passwords match
        if (password !== confirmPassword) {
            return next(new HttpError("Passwords do not match", 422));
        }

        // Hash the password
        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password, salt);

        // Create a new user
        const newUser = await User.create({
            name,
            email: newEmail,
            password: hashedPassword
        });

        // Send response
        res.status(201).json(`New user ${newUser.email}  registered succesfully`)
         
    } catch (error) {
        return next(new HttpError("User registration failed", 500));
    }
}



















//==================== LOGIN  A  REGISTER USER =========POST :api/users/login
//UNPROTECTED
const loginUser = async(req,res,next) =>{
   try{
    const {email,password} = req.body;
    if(!email || !password){
        return next(new HttpError("Please enter all fields", 422));
    }
    const newEmail = email.toLowerCase();

    const user = await User.findOne({email:newEmail});
    if(!user){
        return next(new HttpError("Invalid Details",401));
    }
    const isPasswordCorrect = await bcryptjs.compare(password,user.password);
    if(!isPasswordCorrect){
        return next(new HttpError("Invalid email or password",401));
    }
    const {_id: id,name} = user;
    const token = jwt.sign({id,name},process.env.JWT_SECRET,{expiresIn:"1d"});
    res.status(200).json({message:"Logged in succesfully",token,id,name})
   } catch (error){
     return next(new HttpError("Login failed. please check Your Details",422))
   }


   
}




//==================== USER  PROFILE =========POST :api/users/:id
//PROTECTED
const getUser = async (req,res,next) =>{
   try{
  const {id} = req.params;
  const user = await User.findById(id).select("-password")
  if(!user){
      return next(new HttpError("User not found",404))
  }
  res.status(200).json(user)
   }catch(error){
     return next(new HttpError(error))
   }
}


//====================CHANGE  USER AVATER (profile picture)=========POST :api/users/change-avatar
//PROTECTED

const changeAvatar = async (req, res, next) => {
  console.log(req.files);
  try {
    // Check if avatar file is included in the request
    if (!req.files || !req.files.avatar) {
      return next(new HttpError("Please upload an image", 422));
    }

    // Find user from the database
    const user = await User.findById(req.user.id);

    // Delete old image if it exists
    if (user.avatar) {
      fs.unlink(path.join(__dirname, '..', 'uploads', user.avatar), (err) => {
        if (err) {
          return next(new HttpError("Failed to delete old avatar", 500));
        }
      });
    }

    const { avatar } = req.files;

    // Check file size
    if (avatar.size > 5000000) {
      return next(new HttpError("Image size is too big, should be less than 500k", 422));
    }

    // Generate new filename with UUID
    let fileName = avatar.name;
    let splittedFilename = fileName.split('.');
    let newFilename = `${splittedFilename[0]}_${uuid()}.${splittedFilename[splittedFilename.length - 1]}`;

    // Move the avatar file to the uploads directory
    avatar.mv(path.join(__dirname, '..', 'uploads', newFilename), async (err) => {
      if (err) {
        return next(new HttpError("Failed to save avatar", 500));
      }

      // Update user's avatar field in the database
      const updatedAvatar = await User.findByIdAndUpdate(req.user.id, { avatar: newFilename }, { new: true });

      if (!updatedAvatar) {
        return next(new HttpError("Failed to update avatar", 500));
      }

      // Return the updated avatar filename
      res.status(200).json(updatedAvatar.avatar);
    });
  } catch (error) {
    return next(new HttpError(error.message || "Internal server error", 500));
  }
};





//===================EDIT  USER DETAILS  (from profile )=========POST :api/users/edit-user
//PROTECTED

const editUser =async (req,res,next) =>{
    try{
          const {name,email, currentPassword, newPassword, confirmNewPassword} =req.body;
          if(!name || !email || !currentPassword || !newPassword){
            return next(new HttpError("Please enter all fields", 422));
          }

          // get user from database
          const user = await User.findById(req.user.id)
          if(!user){
            return next(new HttpError("User not found",404))
          }

          // make sure new email does'nt already exist
          const emailExists = await User.findOne({email})
          // we want to uodate other details with/without chnaging the email (which is a unique id because we use it to login)
          if(emailExists && (emailExists._id !=req.user.id)){
            return next(new HttpError("Email already exists",409))
          }
          // check if current password is correct
          const isPasswordCorrect = await bcryptjs.compare(currentPassword,user.password)
          if(!isPasswordCorrect){
            return next(new HttpError("Invalid current password",401))
          }
          // check if new password is valid
          if(newPassword.trim().length < 6){
            return next(new HttpError("Password must be at least 6 characters", 422));
          }
          // check if passwords match
          if(newPassword!== confirmNewPassword){
            return next(new HttpError("Passwords do not match", 422));
          }
          // hash new password
          const salt = await bcryptjs.genSalt(10);
          const hashedPassword = await bcryptjs.hash(newPassword, salt);
          // update user
          const updatedUser = await User.findByIdAndUpdate(req.user.id,{name,email,password:hashedPassword},{new:true})
          if(!updatedUser){
            return next(new HttpError("User couldnt be updated"))
          }
          res.status(200).json(updatedUser)
    }catch{

    }
}


//===================GET ALL USERS=========POST :api/users/authors
//PROTECTED

const getAuthors =async (req,res,next) =>{
    try{
        const authors = await User.find().select("-password")
        res.status(200).json(authors)
    }catch (error){
        return next(new HttpError(error))
    }
   
}


module.exports = {getAuthors, getUser, editUser, loginUser, registerUser, changeAvatar}
