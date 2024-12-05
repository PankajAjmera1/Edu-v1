import mongoose from "mongoose";

const ratingAndReviewsSchema = new mongoose.Schema({

    user:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
    rating: {
        type: Number,
        required: true,
    },
    review:{
        type: String
    }
});

const RatingAndReview = mongoose.model("RatingAndReview", ratingAndReviewsSchema);
export default RatingAndReview;