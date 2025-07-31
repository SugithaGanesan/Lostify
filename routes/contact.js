const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');
const nodemailer = require('nodemailer');

router.post('/', async (req, res) => {
  const { name, email, message } = req.body;

  try {
    // ✅ Save to MongoDB
    const contact = new Contact({ name, email, message });
    await contact.save();

    // ✅ Send Email
    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    let mailOptions = {
      from: email,
      to: process.env.EMAIL_USER,
      subject: `New Contact Message from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\nMessage:\n${message}`
    };

    await transporter.sendMail(mailOptions);

    res.json({ success: true, message: "Message sent & saved successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to send message." });
  }
});

// ✅ View all contact messages (for testing)
router.get('/all', async (req, res) => {
  try {
    const messages = await Contact.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: "Failed to load messages" });
  }
});

module.exports = router;
