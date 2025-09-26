const express = require("express");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");

const app = express();
app.use(bodyParser.json());

// ✅ Gmail SMTP setup
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "wooihong0185@gmail.com",     // 🔹 replace with your Gmail
    pass: "jkjc xmbo hief mtwr"        // 🔹 use Gmail App Password (not normal password)
  }
});

// ✅ POST /send-email endpoint
app.post("/send-email", (req, res) => {
  const { subject, message } = req.body;

  const mailOptions = {
    from: "wooihong0185@gmail.com",
    to: "wooihong0185@gmail.com",        // 🔹 where to send the email
    subject: subject,
    text: message
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("❌ Email error:", error);
      return res.status(500).json({ success: false, error });
    }
    console.log("✅ Email sent:", info.response);
    res.json({ success: true, message: "Email sent!" });
  });
});

// ✅ Start server
const PORT = 4000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
