import User from "../models/User.models.js";
import mailSender from "../utils/mailSender.js";
import crypto from "crypto";
import bcrypt from "bcrypt";


//reset password token
const resetPasswordToken = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        console.log(user);
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User not found"
            })
        }
      const token =crypto.randomBytes(20).toString("hex");
      console.log(token);
      const updateDetails = await User.findOneAndUpdate(
        { email },
        { $set: {
             resetPasswordToken: token,
             resetPasswordExpire: Date.now() + 15 * 60 * 1000
            
            } },
        { new: true }
      );
      console.log(updateDetails);
      const resetPasswordUrl = `http://localhost:5173/reset-password/${token}`;
      const mailResponse = await mailSender(email, "Reset Password from EduTrack", `Click on the link to reset your password ${resetPasswordUrl}`);
      console.log("Email sent Successfully", mailResponse);
      res.status(200).json({
        success: true,
        message: "Email sent Successfully"
      })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Something went wrong while resetting password"
        })
    }           

}



//reset password
const resetPassword = async (req, res) => {
    try {
          const {password,confirmPassword ,token} = req.body;

          if(password !== confirmPassword){
            return res.status(400).json({
                success: false,
                message: "Password and confirm password does not match"
            })
          }

          const userDetails = await User.findOne({resetPasswordToken:token});
          if(!userDetails){
            return res.status(400).json({
                success: false,
                message: "Invalid Token"
            })
          }

          if(userDetails.resetPasswordExpiry < Date.now()){
            return res.status(400).json({
                success: false,
                message: "Token Expired"
            })
          }

          const hashedPassword = await bcrypt.hash(password,10);
          const updatePassword = await User.findOneAndUpdate(
            {resetPasswordToken:token},
            {password:hashedPassword},
            {new:true}
          );
          console.log(updatePassword);
          res.status(200).json({
            success: true,
            message: "Password Reset Successfully"
          })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Something went wrong while resetting password"
        })
    }
}