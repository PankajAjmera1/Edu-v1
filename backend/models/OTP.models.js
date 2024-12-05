import mongoose from "mongoose";
import mailSender from "../utils/mailSender.js";

const OTPSchema = new mongoose.Schema({

    email: {
        type: String,
        required: true,
    },
    otp: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now(),
        expires: 5*60
    }
}    
);  


//send email

async function sendVerificationEmail(email, otp) {
    try {
        const mailResponse = await mailSender(email,"Verification Email from EduTrack",`Your OTP is ${otp}`);
        console.log("Email sent Successfully",mailResponse);

    } catch (error) {
        console.log("error when sending email", error);
        throw error
    }
}

OTPSchema.pre ("save", async function (next) {
    await sendVerificationEmail(this.email, this.otp);
    next();
    
});

const OTP = mongoose.model("OTP", OTPSchema);
export default OTP;