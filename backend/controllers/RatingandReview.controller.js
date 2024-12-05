import RatingAndReview from "../models/RatingAndReview.models.js";
import Course from "../models/Course.models.js";

//create rating

exports.createRating = async (req, res) => {
    try {
      const userId = req.user.id;
      const {rating,review,courseId} = req.body;
      const courseDetails = await Course.findOne({ 
        _id: courseId ,
        studentsEnrolled:{$elemMatch:{$eq:userId}}

      });
      if (!courseDetails) {
        return res.status(400).json({ success: false, message: "Course not found,while rating" });
      }
      const alreadyReviewed = courseDetails.ratingAndReviews.find(
        (review) => review.user.toString() === userId
      );
      if (alreadyReviewed) {
        return res.status(400).json({ success: false, message: "You have already reviewed this course" });
      }
      const ratingReview= await RatingAndReview.create({
        rating, review,
        course:courseId,
        user:userId,
    })

    const updatedCourseDetails=await Course.findByIdAndUpdate({_id:courseId}, 
        {
            $push:{
                ratingAndReviews:ratingReview._id,
            }
        },{new:true},
    )
    console.log("updatedCourseDetails after rating",updatedCourseDetails);
    return res.status(200).json({
        success:true   ,
        message:"Rating and review created successfully",
        ratingReview,
    })


    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }   


}



//getAverageRating
exports.getAverageRating = async (req, res) => {
    try {
        const { courseId } = req.body;
        if (!courseDetails) {
            return res.status(400).json({ success: false, message: "Course not found" });
        }
        const result = await RatingAndReview.aggregate([
            { $match: { course: new mongoose.Types.ObjectId(courseId) } },
            { $group: { _id: null, averageRating: { $avg: "$rating" } } },
        ]);
        const averageRating = result.length > 0 ? result[0].averageRating : 0;
        return res.status(200).json({ success: true, averageRating });

      
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

//getAllRating

exports.getAllRating = async (req, res) => {
    try {
        const allReview =await RatingAndReview.find({})
                                                     .sort({rating:"desc"})
                                                     .populate({
                                                        path:"user",
                                                        select:"firstName lastName email"

                                                     })
                                                     .populate({
                                                        path:"course",
                                                        select:"courseName"
                                                     }).exec();
        return res.status(200).json({ 
            
            success: true, 
            message: "All rating fetched successfully",
            allReview });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};  




