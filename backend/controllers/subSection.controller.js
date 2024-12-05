import SubSection from "../models/SubSection.models.js";
import Section from "../models/Section.models,js";
import  uploadImageToClodinary from "../utils/imageupload.js";
 


//creating subsection
exports.createSubSection = async (req, res) => {
    try {
        const { title, timeDuration, description,  sectionId } = req.body;
        const video=req.files.videoFile;
        if (!title || !timeDuration || !description || !sectionId || !video) { {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }
        }
        const uploadDetails = await uploadImageToClodinary(video, process.env.FOLDER_NAME);

        const SubSectionDetails = await SubSection.create({ title, timeDuration, description, videoUrl: uploadDetails.secure_url });
        console.log(SubSectionDetails);
        const updatedSection = await Section.findByIdAndUpdate(
            { _id: sectionId },
            { $push: { "subSections": SubSectionDetails._id } },
            { new: true }
        ).populate("subSections").exec();
        console.log(updatedSection);
        res.status(200).json({
            success: true,
            message: "SubSection created successfully",
            updatedSection         
        });


       
    }    
     
    catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Internal server error,while creating SubSection" });

    }
}   



//update subsection
exports.updateSubSection = async (req, res) => {
    try {
        const { title, timeDuration, description, subSectionId } = req.body;
        const video=req.files.videoFile;
        
        if (!title || !timeDuration || !description || !subSectionId) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }
        const updatedSubSection = await SubSection.findOneAndUpdate(
            { _id: subSectionId },
            { $set: { title, timeDuration, description, videoUrl: uploadDetails.secure_url } },
            { new: true }
        );
        console.log(updatedSubSection);
        res.status(200).json({
            success: true,
            message: "SubSection updated successfully",
            updatedSubSection
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Internal server error,while updating SubSection" });   

    }


}


//delete subsection
exports.deleteSubSection = async (req, res) => {
    try {
        const { subSectionId } = req.params;
        const deletedSubSection = await SubSection.findByIdAndDelete({ _id: subSectionId });
        console.log(deletedSubSection);
        res.status(200).json({
            success: true,
            message: "SubSection deleted successfully",
            deletedSubSection
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Internal server error,while deleting SubSection" });
    }
}

