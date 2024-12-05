import jwt from 'jsonwebtoken';
import User from '../models/User.models.js';


//auth
exports.auth = async (req, res, next) => {
    try{

        //extract token
        const token = req.header("Authorization").replace("Bearer ", "");
        if(!token){
                return res.status(401).json({
                success: false,
                message: "Unauthorized,token not found"
            })
        }

        //verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log(decoded);
        req.user = decoded;
        next();

    }catch(error){
        console.log(error);
        return res.status(401).json({
            success: false,
            message: "something went wrong while verifying token"
        })
    }
}




//student
exports.isStudent = async (req, res, next) => {
    try{
        if(req.user.accountType === "Student"){
            next();

        }
        else{
            return res.status(401).json({
                success: false,
                message: "This is not a student account"
            })
        }
    }
    catch(error){
        console.log(error);
        return res.status(401).json({
            success: false,
            message: "user role cannot be verified"
        })
    }
}



//isInstructor

exports.isInstructor = async (req, res, next) => {
    try{
        if(req.user.accountType === "Instructor"){
            next();

        }
        else{
            return res.status(401).json({
                success: false,
                message: "This is not a Instructor account"
            })
        }
    }
    catch(error){
        console.log(error);
        return res.status(401).json({
            success: false, 
            message: "user role cannot be verified"
        })
    }
}
//isAdmin

exports.isAdmin = async (req, res, next) => {
    try{
        if(req.user.accountType === "Admin"){
            next();

        }
        else{
            return res.status(401).json({
                success: false,
                message: "This is not a Admin account"
            })
        }
    }
    catch(error){
        console.log(error);
        return res.status(401).json({
            success: false, 
            message: "user role cannot be verified"
        })
    }
}


