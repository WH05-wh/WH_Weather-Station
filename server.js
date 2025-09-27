// Import required packages
const express = require("express");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const cors = require("cors");

const app = express();
app.use(bodyParser.json());
app.use(cors());

// 📧 Configure Gmail transporter
let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "wooihong0185@gmail.com",     
    pass: "jkjc xmbo hief mtwr"         
  }
});

// 📩 API route to send email
app.post("/send-email", (req, res) => {
  const { subject, message } = req.body;

  let mailOptions = {
    from: '"ESP32 Rain Sensor" <wooihong0185@gmail.com>',
    to: "wooihong0185@gmail.com",         //recipient email
    subject: subject || "ESP32 Rain Alert",
    text: message || "Rain detected from ESP32!"
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("❌ Error:", error);
      return res.status(500).json({ success: false, error });
    }
    console.log("✅ Email sent:", info.response);
    res.json({ success: true, info });
  });
});
+++
// 🚀 Use Render's port or fallback to 3000 for local
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(✅ Server running on port ${PORT});
});





