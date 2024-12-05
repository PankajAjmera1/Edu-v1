import Course from "../models/Course.models.js";
import Tag from "../models/category.models.js";
import User from "../models/User.models.js";
import { uploadImageToClodinary } from "../utils/imageupload.js";
import Category from "../models/category.models.js";



// //creating course
// exports.createCourse = async (req, res) => {
//     try {
//         const { courseName, courseDescription, whatYouWillLearn, price, tag } = req.body;
//         //get thumnail
//         const thumbnail = req.files.thumnailImage;

//         //validate data
//         if (!courseName || !courseDescription || !whatYouWillLearn || !price || !tag) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Please fill all the fields"
//             })
//         }

//         //check for instructor
//         const instructorDetails = await User.findOne({ _id: req.user._id });
//         console.log("instructorDetails", instructorDetails);
        
//         if (!instructorDetails) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Instructor Details not found"
//             })
//         }

//         //check given tag
//         const tagDetails = await Tag.findById({ tag });
//         if (!tagDetails) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Tag Details not found"
//             })
//         }


//         //upload image to cloudinary
//         const thumbnailImage = await uploadImageToClodinary(thumbnail, process.env.FOLDER_NAME);
//         console.log("thumbnailImage", thumbnailImage);


//         //crewate course
//         const newCourse = await Course.create({

//             courseName,
//             courseDescription,
//             instructor: instructorDetails._id,
//             whatYouWillLearn,
//             price,
//             thumbnail: thumbnailImage.secure_url,
//             tag: tagDetails._id
//         });

//         console.log("newCourse", newCourse);
//         //add the new course to the instructor

//         await User.findByIdAndUpdate(
//             { _id: instructorDetails._id },
//             {
//                 $push: {
//                     courses: newCourse._id
//                 }
//             },
//             { new: true }
//         );


//         //update tag schema
//         await Tag.findByIdAndUpdate(
//             { _id: tagDetails._id },
//             {
//                 $push: {
//                     course: newCourse._id
//                 }
//             },
//             { new: true }
//         );


//         res.status(200).json({
//             success: true,  
//             message: "Course created successfully",
//             newCourse
//         })


//     }
//     catch (error) {
//         console.log(error);
//         res.status(500).json({ success: false, message: "failed to create course" });
//     }

// }


// //get all course
// exports.showAllCourse = async (req, res) => {
//     try {
//         const allCourses = await Course.find({},{
//             courseName:true,
//             price:true,
//             thumbnail:true,
//             instructor:true,
//             ratingAndReviews:true,
//             studentsEnrolled:true

//         }).populate("instructor").exec();
//         res.status(200).json({
//             success: true,
//             message: "Course fetched successfully",
//             allCourses
//         })
//     }
//     catch (error) {
//         console.log(error);     
//     }
// }



exports.createCourse = async (req,res) => {
    try {
        const{courseName, courseDescription, whatWillYouLearn, price, category,tags,status, instructions} = req.body;

        const thumbnail = req.files.thumbnailImage;
        console.log("Thumbnail in course creation is", thumbnail)
        if(!courseName || !courseDescription || !whatWillYouLearn || !price || !category || !thumbnail || !status || !instructions) {
            return res.status(400).json({
                success:false,
                message:'All fields are required',
            });
        }

        const instructorId = req.user.id;

        const categoryDetails = await Category.findById(category);
        if(!categoryDetails) {
            return res.status(404).json({
                success:false,
                message:'Category Details not found',
            });
        }

        const thumbnailImage = await  uploadImageToClodinary(thumbnail,process.env.FOLDER_NAME);

        const newCourse = await Course.create({
            courseName,
            description:courseDescription,
            whatWillYouLearn,
            price,
            thumbnail:thumbnailImage.secure_url,
            category,
            instructor:instructorId,
            tags,
            status,
            instructions
        })

        await Category.findByIdAndUpdate(category,
            {
                $push: {
                    course: newCourse._id
                }
            })

        await User.findByIdAndUpdate(instructorId, {
            $push: {
                courses: newCourse._id
            }})
            
        return res.status(200).json({
            success:true,
            message:'Course created successfully',
            newCourse
        })    
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success:false,
            message:'Failed to create Course',
            error: error.message,
        })
    }
}

exports.showAllCourses = async (req,res) => {
    try {
        const allCourses = Course.find({}, {
            courseName: true,
            price: true,
            thumbnail: true,
            instructor: true,
            ratingAndReviews: true,
            studentsEnroled: true,
        }).populate("instructor").exec();

        return res.status(200).json({
            success:true,
            message:'Data for all courses fetched successfully',
            data:allCourses,
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success:false,
            message:'Failed to show all Courses',
            error: error.message,
        })
    }
}
 

//get course details

exports.getCourseDetails = async (req, res) => {
    try {
        const { courseId } = req.body;
        const courseDetails = await Course.findById(courseId).populate({
            path: "instructor",
            populate: {
                path: "additionalDetails",
                
            },
        } )
        .populate("category")
        .populate("ratingAndReviews")
        .populate({
            path:"courseContent",
            populate: {
                path:"subSection"
            }
        })
        .exec();
        if (!courseDetails) {
            return res.status(404).json({
                success: false,
                message: "Course not found with ${courseId}",
            });
        }
        return res.status(200).json({
            success: true,
            message: "Course details fetched successfully", 
            courseDetails
        }); 
    } catch (error) {
        console.log(error);
        return res.status(500).json({   


            success: false,
            message: "Failed to fetch course details",
            error: error.message,       
        });
    }
}

