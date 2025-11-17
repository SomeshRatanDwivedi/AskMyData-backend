import nodemailer from "nodemailer";

// OTP generator
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Create transporter (Gmail example)
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.MAIL,
    pass: process.env.MAIL_PASS,
  },
});

// Mail sender
export const sendMail = async (email) => {
  const otp = generateOTP();

  const htmlTemplate = `
  <div style="font-family:Arial; padding:20px; max-width:500px; margin:auto; border:1px solid #ddd; border-radius:10px;">
    <h2 style="text-align:center; color:#4f46e5;">AskMyData Verification</h2>
    <p>Hello,</p>
    <p>Your OTP for verification is:</p>

    <div style="text-align:center; padding:15px; background:#f3f4f6; margin:20px 0; border-radius:8px;">
      <span style="font-size:32px; font-weight:700; letter-spacing:4px; color:#111;">${otp}</span>
    </div>

    <p>This OTP is valid for <b>10 minutes</b>. Do not share it with anyone.</p>

    <p style="margin-top:30px;">Regards,<br><b>AskMyData Team</b></p>
  </div>
  `;

  try {
    const info = await transporter.sendMail({
      from: `"AskMyData" <${process.env.MAIL}>`,
      to: email,
      subject: "Your AskMyData OTP",
      html: htmlTemplate,
    });
    if (info) {
      return otp;
    } else {
      throw new Error("Error in sending mail.")
    }
    
  } catch (err) {
    console.error("Error sending mail:", err);
    throw err;
  }
};
