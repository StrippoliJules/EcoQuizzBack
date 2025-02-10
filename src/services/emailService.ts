import nodemailer from "nodemailer";

const emailUser = process.env.EMAIL_USER;
const emailPassword = process.env.EMAIL_PASSWORD;

if (!emailUser || !emailPassword) {
  console.error("Email user or password not set in environment variables");
  throw new Error("Email credentials are not set");
}

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: emailUser,
    pass: emailPassword,
  },
});

const sendEmail = async (to: string, subject: string, text: string) => {
  const mailOptions = {
    from: emailUser,
    to,
    subject,
    text,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error(`Error sending email to ${to}:`, error);
  }
};

export { sendEmail };
