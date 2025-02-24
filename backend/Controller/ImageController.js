const express = require("express");
const multer = require("multer");
const Image = require("../Modals/ImageFolder");
const requireSignIn = require("../middleware/authMiddleware");

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});

const upload = multer({ storage });

router.post(
  "/upload",
  requireSignIn,
  upload.single("image"),
  async (req, res) => {
    try {
      const { name, folder } = req.body;
      if (!name || !req.file)
        return res.status(400).json({ message: "Name and image are required" });

      const imageUrl = `/uploads/${req.file.filename}`;
      const image = await Image.create({
        name,
        imageUrl,
        folder,
        user: req.user.id,
      });

      res.status(201).json(image);
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  }
);

router.get("/", requireSignIn, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const images = await Image.find({ user: req.user.id })
      .skip(skip)
      .limit(limit);

    const totalImages = await Image.countDocuments({ user: req.user.id });

    res.status(200).json({
      success: true,
      totalImages,
      totalPages: Math.ceil(totalImages / limit),
      currentPage: page,
      images,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});


router.get("/search", requireSignIn, async (req, res) => {
  try {
    const { query } = req.query;
    if (!query)
      return res.status(400).json({ message: "Search query is required" });

    const images = await Image.find({
      user: req.user.id,
      name: { $regex: query, $options: "i" },
    });
    res.status(200).json(images);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

module.exports = router;
