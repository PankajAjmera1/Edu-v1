import Section from "../models/Section.models.js";
import Course from "../models/Course.models.js";


//creating section
exports.createSection = async (req, res) => {
    try {
        const { sectionName, courseID } = req.body;
       if(!sectionName || !courseID){
        return res.status(400).json({
            success: false,
            message: "Please fill all the fields"
        })
       }
       //use populate to replace sections/subsections both in the updatedCourseDetails

       const newSection = await Section.create({sectionName});
       const updatedCourseDetails = await Course.findOneAndUpdate(
        { _id: courseID }, 
        { $push: { "courseContent": newSection._id } }, 
        { new: true }).populate("courseContent").exec();

       console.log("updatedCourseDetails", updatedCourseDetails);
       res.status(200).json({
        success: true,
        message: "Section created successfully",
        updatedCourseDetails
       })

      

    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error,while creating section"
        })
    }

}



//update section
exports.updateSection = async (req, res) => {
    try {
        const{sectionName,sectionId} = req.body;
        if(!sectionName || !sectionId){
            return res.status(400).json({
                success: false,
                message: "Please fill all the fields"
            })
           }

        const updatedSection = await Section.findOneAndUpdate(
            { _id: sectionId },
            { $set: { sectionName } },
            { new: true }
        );

        res.status(200).json({
            success: true,
            message: "Section updated successfully",
            updatedSection
           })


    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error,while updating section"
        })
    }
}


//delete section
exports.deleteSection = async (req, res) => {
    try {
        const { sectionId } = req.params;
        const deletedSection = await Section.findByIdAndDelete({ _id: sectionId });
        console.log(deletedSection);
        res.status(200).json({
            success: true,
            message: "Section deleted successfully",
            
           })
           
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error,while deleting section"
        })
    }
}