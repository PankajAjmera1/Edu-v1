import Profile from "../models/Profile.models.js";
import User from "../models/User.models.js";



//update profile

exports.updateProfile = async (req, res) => {
    try {
        const {dateOfBirth="",about="",contactNumber,gender} = req.body;
        const id = req.user._id;
        if(!id ||  !contactNumber || !gender){
            return res.status(400).json({
                success: false,
                message: "Please fill all the fields"
            })
        }
        const userDetails = await User.findById(id);
        if(!userDetails){
            return res.status(400).json({
                success: false,
                message: "User not found"
            })
        }
       const profileId =userDetails.additionalDetails;
       const profileDetails = await Profile.findById(profileId);
       if(!profileDetails){
        return res.status(400).json({
            success: false,
            message: "Profile not found"
        })
       }
       //update profile
       profileDetails.dateOfBirth = dateOfBirth;
       profileDetails.about = about;
       profileDetails.contactNumber = contactNumber;
       profileDetails.gender = gender;
       await profileDetails.save();
       res.status(200).json({
        success: true,
        message: "Profile updated successfully",
        profileDetails
       })
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Internal server error,while updating profile"
        })
    }
}



//delete account
exports.deleteAccount = async (req, res) => {
    try {
        const id = req.user._id;
        const userDetails = await User.findById({ _id: id });
        if (!userDetails) {
            return res.status(400).json({
                success: false,
                message: "User not found"
            })
        }
       await Profile.findByIdAndDelete({ _id: userDetails.additionalDetails });
       await User.findByIdAndDelete({ _id: id });
       res.status(200).json({
        success: true,
        message: "Account deleted successfully"
       })

       // todo:chrone job

    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Internal server error,while deleting account"
        })
    }

}


exports.getAllUserDetails = async (req, res) => {
    try {
        const id = req.user._id;
        const userDetails = await User.findById({ _id: id }).populate("additionalDetails").exec;
        if (!userDetails) {
            return res.status(400).json({
                success: false,
                message: "User not found"
            })
        }
        res.status(200).json({
            success: true,
            message: "User details fetched successfully",
            userDetails
        })
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Internal server error,while getting user details"
        })
    }   
}