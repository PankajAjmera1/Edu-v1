
import User from "../models/User.models.js";
import OTP from "../models/OTP.models.js";
import otpGenerator from "otp-generator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";





//send otp

exports.sendOTP = async (req, res) => {
    try {
        const { email } = req.body;

        const checkUserPresent = await User.findOne({ email });
        if (checkUserPresent) {
            return res.status(400).json({
                success: false,
                message: "User already present"
            })
        }

        //generate otp
        const otp = otpGenerator.generate(6, {
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false
            

        });
        console.log(otp);

        

        //save otp in db
        const otpPayload = {
            email,
            otp
        }
        //create entry in 
        const otpBody = await OTP.create(otpPayload);
        console.log(otpBody);

        //return response
        return res.status(200).json({
            success: true,
            message: "OTP sent successfully",
            otp
        });



       




    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "error.message"
        })
    }


}



//signup
exports.signUp =async(req,res)=>{
    try {
         const {
            firstName,
            lastName,
            email,
            password,
            confirmPassword,
            accountType,
            contactNumber,
            otp,
            additionalDetails
         } = req.body;

         //vlidate data
         if(!firstName || !lastName || !email || !password || !confirmPassword || !otp){
            return res.status(403).json({
                success: false,
                message: "Please fill all the fields"
            })
         }

         if(password !== confirmPassword){
            return res.status(403).json({
                success: false,
                message: "Password and confirm password does not match"
            })
         }
         //check user 
         const existingUser = await User.findOne({email});
         if(existingUser){
            return res.status(400).json({
                success: false,
                message: "User already registered"
            })
         }
         //find most recent otp
         const recentOtp = await OTP.findOne({email}).sort({createdAt:-1}).limit(1);
         console.log(recentOtp);
         //validate otp
         if(recentOtp.otp !== otp){
            return res.status(400).json({
                success: false,
                message: "Invalid OTP"
            })
         }else if(recentOtp.length === 0){
            return res.status(400).json({
                success: false,
                message: "Invalid OTP"
            })
         }


         //hash password
         const hashedPassword = await bcrypt.hash(password,10);

         //profile
         const profileDetails = await Profile.create({
            gender:null,
            dateOfBirth:null,
            about:null,
            contactNumber:null,

         });
         const userPayload = {
            firstName,
            lastName,
            email,
            password: hashedPassword,
            accountType,
            contactNumber,
            additionalDetails:profileDetails._id,
            image:`https://api.dicebear.com/6.x/initials/svg?seed=${firstName} ${lastName}`
         }
         const user = await User.create(userPayload);
         console.log(user);
         return res.status(200).json({
            success: true,
            message: "User registered successfully",
            user,
         }) 



         
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "User registration failed,please try again"     
        })
    }
}



//login
exports.login = async(req,res)=>{
    try {
        
         //get data from body
         const {email,password} = req.body;

         //validate data
         if(!email || !password){
            return res.status(403).json({
                success: false,
                message: "Please fill all the fields"
            })
         }
         //user check
         const user = await User.findOne({email}).populate("additionalDetails");
         if(!user){
            return res.status(400).json({
                success: false,
                message: "User does not exist"
            })
         }
         //password check
         const isMatch = await bcrypt.compare(password,user.password);
         if(!isMatch){
            return res.status(400).json({
                success: false,
                message: "Invalid Password"
            })
         }
                //token
                const payload = {
                    email:user.email,
                    id:user._id,
                    accountType:user.accountType
                   
                }
                const token =jwt.sign(payload,process.env.JWT_SECRET,{expiresIn:"1d"});
                user.token = token;
                user.password = undefined;

                //crate cookie and send response
                const options = {
                    expires: new Date(Date.now() + 3*24*60*60*1000),
                    httpOnly: true
                }
                res.cookie("token",token,options).status(200).json({
                    success: true,
                    token,
                    user,
                    message: "User logged in successfully",
                })


                



    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "User login failed,please try again"     
        })
    }
} 


//change password
exports.changePassword = async(req,res)=>{
    try {

        //get data from body
        const {oldPassword,newPassword,confirmNewPassword} = req.body;
        
        //get old password,newPassword,confirmNewPassword


        //validation
        //update password in db with hashed password
        //send mail password changed
        //return response
        
    } catch (error) {
        
    }
}

