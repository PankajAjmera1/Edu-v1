import nodemailer from "nodemailer";


// exports.mailSender = async (email, subject, body) => {
//     try {
//         let transporter = nodemailer.createTransport({
//             host:process.env.MAIL_HOST,
//             auth:{
//                 user:process.env.MAIL_USER,
//                 pass:process.env.MAIL_PASS
//             }

            
//         });

//         let info = await transporter.sendMail({
//             from:'"EduTrack"  ',
//             to:`${email}`,
//             subject:`${subject}`,
//             html:`${body}`
//         });
//         console.log("info",info);  
//         return info; 
//     } catch (error) {
//         console.log(error);
        
//     }
// }


export default async function mailSender(email, subject, body) {
    try {
        let transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS
            }
        });

        let info = await transporter.sendMail({
            from: '"EduTrack" ',
            to: `${email}`,
            subject: `${subject}`,
            html: `${body}`
        });
        console.log("info", info);
        return info;
    } catch (error) {
        console.log(error);
    }
}


    