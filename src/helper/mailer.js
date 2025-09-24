import crypto from "crypto";
import { User } from "@/lib/models/userModel";
import nodemailer from "nodemailer";


export const sendEmail = async ({ email, emailType, userId }) => {
  try {
    const token = crypto.randomBytes(32).toString("hex");

    if (emailType === "VERIFY") {
      await User.findByIdAndUpdate(userId, {
        $set: {
          verifyToken: token,
          verifyTokenExpiry: Date.now() + 3600000 // 1 hour
        }
      });
    } else if (emailType === "RESET") {
      await User.findByIdAndUpdate(userId, {
        $set: {
          forgotPasswordToken: token,
          forgotPasswordExpiry: Date.now() + 3600000
        }
      });
    }

    const transporter = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: "d50dc6f9696264",
        pass: "1831bf25654221"
      }
    });

    const mailOptions = {
      from: 'manitnayak002@gmail.com',
      to: email,
      subject: emailType === "VERIFY" ? "Verify your email" : "Reset your password",
      html: `<p>
        Click <a href="${process.env.DOMAIN}/verifyemail?token=${token}">here</a> 
        to ${emailType === "VERIFY" ? "verify your email" : "reset your password"}<br/>
        Or copy and paste this link:<br/>
        ${process.env.DOMAIN}/verifyemail?token=${token}
      </p>`,
    };

    return await transporter.sendMail(mailOptions);

  } catch (error) {
    console.log("error while sending email", error);
    throw error;
  }
};




// import { User } from '@/lib/models/userModel';
// import nodemailer from 'nodemailer';
// import bcryptjs from 'bcryptjs';

// export const sendEmail = async ({ email, emailType, userId }) => {
//     try {
//         const hashedToken = await bcryptjs.hash(userId.toString(), 10);

//         if (emailType === "VERIFY") {
//             await User.findByIdAndUpdate(userId, {
//                 $set: {
//                     verifyToken: hashedToken,
//                     verifyTokenExpiry: Date.now() + 3600000 // 1 hour
//                 }
//             });
//         } else if (emailType === "RESET") {
//             await User.findByIdAndUpdate(userId, {
//                 $set: {
//                     forgotPasswordToken: hashedToken,
//                     forgotPasswordExpiry: Date.now() + 3600000 // 1 hour
//                 }
//             });
//         }

//         const transporter = nodemailer.createTransport({
//             host: "sandbox.smtp.mailtrap.io",
//             port: 2525,
//             auth: {
//                 user: "d50dc6f9696264",
//                 pass: "1831bf25654221"
//             }
//         });

//         const mailOptions = {
//             from: 'manitnayak002@gmail.com',
//             to: email,
//             subject: emailType === "VERIFY" ? "Verify your email" : "Reset your password",
//             html: `<p>
//                 Click <a href="${process.env.DOMAIN}/verifyemail?token=${hashedToken}">here</a> 
//                 to ${emailType === "VERIFY" ? "verify your email" : "reset your password"}<br/>
//                 Or copy and paste the link below into your browser:<br/>
//                 ${process.env.DOMAIN}/verifyemail?token=${hashedToken}
//             </p>`,
//         };

//         const mailResponse = await transporter.sendMail(mailOptions);
//         return mailResponse;

//     } catch (error) {
//         console.log("error while sending email", error);
//         throw error; // propagate error instead of silently failing
//     }
// };
