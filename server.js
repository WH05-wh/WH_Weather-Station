// Import required packages
const express = require("express");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const cors = require("cors");

const app = express();
app.use(bodyParser.json());
app.use(cors());

// 📧 Configure Gmail transporter (use env vars in Render for security)
let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER || "wooihong0185@gmail.com",  // fallback for local test
    pass: process.env.EMAIL_PASS || "jkjc xmbo hief mtwr"      // Gmail App Password
  }
});

// 📩 API route to send email
app.post("/send-email", (req, res) => {
  const { subject, message } = req.body;

  let mailOptions = {
    from: `"ESP32 Rain Sensor" <${process.env.EMAIL_USER || "wooihong0185@gmail.com"}>`,
    to: process.env.EMAIL_TO || process.env.EMAIL_USER || "wooihong0185@gmail.com",
    subject: subject || "ESP32 Rain Alert",
    text: message || "Rain detected from ESP32!"
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("❌ Error:", error);
      return res.status(500).json({ success: false, error: error.message });
    }
    console.log("✅ Email sent:", info.response);
    res.json({ success: true, info });
  });
});

// 🚀 Use Render's port or fallback to 3000 for local
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
