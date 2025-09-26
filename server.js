const express = require("express");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");

const app = express();
app.use(bodyParser.json());

// ✅ Gmail SMTP setup (uses environment variables)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.wooihong0185@gmail.com,
    pass: process.env.jkjc xmbo hief mtwr
  }
});

// ✅ POST /send-email endpoint
app.post("/send-email", (req, res) => {
  const { subject, message } = req.body;

  const mailOptions = {
    from: process.env.wooihong0185@gmail.com,
    to: process.env.EMAIL_TO || process.env.wooihong0185@gmail.com, // send to yourself or another
    subject,
    text: message
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("❌ Email error:", error);
      return res.status(500).json({ success: false, error: error.message });
    }
    console.log("✅ Email sent:", info.response);
    res.json({ success: true, message: "Email sent!" });
  });
});

// ✅ Start server (Render needs process.env.PORT)
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
