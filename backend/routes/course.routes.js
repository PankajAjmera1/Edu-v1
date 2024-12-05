import express from "express";
const router = express.Router();
import { createCourse,showAllCourses,getCourseDetails } from "../controllers/course.controller.js";

//categories
import {createCategory,showAllCategories,categoryPageDetails} from "../controllers/category.controller.js";


//sections
import {createSection,updateSection,deleteSection} from "../controllers/section.controller.js";

//subsections
import {createSubSection,updateSubSection,deleteSubSection} from "../controllers/subSection.controller.js";


//rating
import {createRating,getAverageRating,getAllRating} from "../controllers/RatingandReview.controller.js";


//middleware
import { auth ,isAdmin,isInstructor,isStudent} from "../middlewares/auth.middleware.js";