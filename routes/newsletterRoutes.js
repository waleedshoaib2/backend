import nodemailer from "nodemailer";

const mailTransporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "waleedshoaib20@gmail.com",
    pass: "*************",
  },
});

const mailDetails = {
  from: "xyz@gmail.com",
  to: "abc@gmail.com",
  subject: "Test mail",
  text: "Node.js testing mail for GeeksforGeeks",
};

mailTransporter
  .sendMail(mailDetails)
  .then(() => console.log("Email sent successfully"))
  .catch((err) => console.log("Error Occurs", err));

async function sendEmail() {
  try {
    await mailTransporter.sendMail(mailDetails);
    console.log("Email sent successfully");
  } catch (err) {
    console.log("Error Occurs", err);
  }
}

sendEmail();
