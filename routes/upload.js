const express = require("express");
const router = express.Router();

const cloudinary = require("../utils/cloudinary");
const multer = require("multer");

// Use memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Upload route
router.post("/upload", upload.single("image"), async (req, res) => {
  try {
    const fileStr = `data:image/png;base64,${req.file.buffer.toString("base64")}`;

    const uploadedResponse = await cloudinary.uploader.upload(fileStr, {
      folder: "lostify_uploads",
    });

    res.json({ url: uploadedResponse.secure_url });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ error: "Failed to upload image" });
  }
});

module.exports = router;
