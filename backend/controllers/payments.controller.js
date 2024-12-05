
import {instance} from "../config/rayzorpay.js";
import Course from "../models/Course.models.js";
import User from "../models/User.models.js";
import mailSender from "../utils/mailSender.js";


//capture payment and initiate rayzorpay order

exports.capturePayment = async (req, res) => {
    
        const {course_id} = req.body;
        const userId = req.user.id;

        if(!course_id){
            return res.status(400).json({
                success: false,
                message: "Please fill all the fields,course id is required"
            })
        }
        let course; 
        try{
         course =await Course.findById(course_id).exec();
            if(!course){
                return res.status(400).json({
                    success: false,
                    message: "Course not found"
                })
            }
          //user already enrolled in the course
          const uid =new mongoose.Types.ObjectId(userId);
          if(course.studentsEnrolled.includes(uid)){
            return res.status(400).json({
                success: false,
                message: "User already enrolled in the course"
            })

        }
          
    }
    catch (error) {

        console.log(error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }


    //order create
    const amount = course.price;
    const currency = "INR";
    const options = {
        amount:amount*100,
        currency,
        receipt:Math.random().toString(36).substring(2, 9),
        notes:{
            courseId:course_id,
            userId:userId
        }
    };

    try {
        //initiated the payment
        const paymentResponse = await instance.orders.create(options);
        console.log(paymentResponse);
        res.status(200).json({
            success: true,
            message: "Payment initiated successfully",
            paymentResponse,
            courseName:course.courseName,
            courseDescription:course.courseDescription,
            thumabnail:course.thumbnail,
            orderId:paymentResponse.id  ,
            currency:paymentResponse.currency,
            amount:paymentResponse.amount

            
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Internal server error,while payment" });
    }
      
}



//verify signature of rayzorpay and server
exports.verifySignature = async (req, res) => {
    try{
        const webhookSecret = process.env.RAYZORPAY_WEBHOOK_SECRET;
        const signature = req.headers['x-razorpay-signature'];
        const shasum = crypto.createHmac('sha256', webhookSecret);
        shasum.update(JSON.stringify(req.body));
        const digest = shasum.digest('hex');
        if (signature === digest) {
            // Payment is successful, process it
            const {courseId,userId} = req.body.payload.payment.entity.notes;
            const enrolledCourse = await Course.findOneAndUpdate(
                { _id: courseId },
                 { $push: { "studentsEnrolled": userId } },
                  { new: true });
            if(!enrolledCourse){
                return res.status(400).json({
                    success: false,
                    message: "Course not found"
                })
            }      
            console.log(enrolledCourse);

            //find the student 
            const enrolledStudent =await User.findOneAndUpdate(
                { _id: userId },
                 { $push: { "courses": courseId } },
                  { new: true });
               
            console.log(enrolledStudent);
            const emailResponse =await mailSender(
                enrolledStudent.email,

                "Course Enrolled from EduTrack",
                `You have successfully enrolled in the course ${enrolledCourse.courseName}`
            )



            res.status(200).json({ success: true, message: "Payment verified successfully" });
        } else {
            // Payment is not successful
            res.status(400).json({ success: false, message: "Payment verification failed" });
        }   
    }
    catch(error){
        console.log(error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}
