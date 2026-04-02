const nodemailer = require("nodemailer");
const { smtpUsername, smtpPassword } = require("../secret");

// Create a transporter using SMTP
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: smtpUsername,
    pass: smtpPassword,
  },
});

const emailWithNodeMail = async (emailData) => {
  try {
    if (!emailData || !emailData.email) {
      throw new Error("No recipient email provided to emailWithNodeMail");
    }

    const mailOptions = {
      from: smtpUsername, // sender
      to: emailData.email, // recipient (string or array)
      subject: emailData.subject || "No subject",
      html: emailData.html || "<p>No content</p>",
    };

    console.log("Mail options:", mailOptions); // debug before send

    const info = await transporter.sendMail(mailOptions);
    console.log("Message sent: %s", info.response);
    return info;
  } catch (error) {
    console.error("Error occurred while sending email:", error);
    throw error;
  }
};

module.exports = { emailWithNodeMail };
