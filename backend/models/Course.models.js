import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
    courseName: {
        type: String
    },
    courseDescription: {
        type: String
    },
    instructor:{

        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
    whatYouWillLearn: {
        type: String
    },
    courseContent: [
        {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "Section",
        }
    ],
    ratingAndReviews: [
        {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "RatingAndReview",
        }
    ],
    price: {
        type: Number
    },
    thumbnail: {
        type: String
    },
    tags:{
        type:String
    },
    category:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Category"
    },
    studentsEnrolled: [
        {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "User",
        }
    ],
    instructions: {
		type: String,
	},
    status: {
		type: String,
		enum: ["Draft", "Published"],
	},

    createdAt: {
		type:Date,
		default:Date.now
	},
  
    });

const Course = mongoose.model("Course", courseSchema);
export default Course;