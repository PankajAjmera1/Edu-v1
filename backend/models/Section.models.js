import mongoose from "mongoose";
import SubSection from "./SubSection.models";

const sectionSchema = new mongoose.Schema({
     sectionName:{
          type: String,
     },
     SubSection:[
        {
             type: mongoose.Schema.Types.ObjectId,
             required: true,
             ref: "SubSection",
        }
     ]


});

const Section = mongoose.model("Section", sectionSchema);
export default Section;