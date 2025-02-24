const express = require("express");
const multer = require("multer");
const Image = require("../Modals/ImageFolder");
const requireSignIn = require("../middleware/authMiddleware");

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

// Upload Image
router.post(
  "/upload",
  requireSignIn,
  upload.single("image"),
  async (req, res) => {
    try {
      const { name, folder } = req.body;
      if (!name || !req.file) {
        return res.status(400).json({ message: "Name and image are required" });
      }

      const existingImage = await Image.findOne({ name, folder });
      if (existingImage) {
        return res.status(400).json({
          message: "An image with this name already exists in the folder",
        });
      }

      const image = await Image.create({
        name,
        image: {
          data: req.file.buffer,
          contentType: req.file.mimetype,
        },
        folder,
        user: req.user.id,
      });

      res.status(201).json(image);
    } catch (error) {
      console.error("Upload Error:", error);
      res.status(500).json({ message: "Server error", error });
    }
  }
);

// Get images for a specific folder
router.get("/list/:folderId", requireSignIn, async (req, res) => {
  try {
    const { folderId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 4;
    const skip = (page - 1) * limit;

    // Fetch images for the logged-in user and the specific folder
    const images = await Image.find({ user: req.user.id, folder: folderId })
      .skip(skip)
      .limit(limit)
      .select("name image.contentType image.data");

    const totalImages = await Image.countDocuments({
      user: req.user.id,
      folder: folderId,
    });

    res.status(200).json({
      success: true,
      totalImages,
      totalPages: Math.ceil(totalImages / limit),
      currentPage: page,
      images: images.map((img) => ({
        _id: img._id,
        name: img.name,
        contentType: img.image.contentType,
        imageUrl: `data:${
          img.image.contentType
        };base64,${img.image.data.toString("base64")}`,
      })),
    });
  } catch (error) {
    console.error("Fetch Images Error:", error);
    res.status(500).json({ message: "Server error", error });
  }
});

router.delete("/:imageId", async (req, res) => {
  const { imageId } = req.params;

  try {
    const image = await Image.findById(imageId);
    if (!image) {
      return res
        .status(404)
        .json({ success: false, message: "Image not found" });
    }
    await Image.findByIdAndDelete(imageId);

    res.json({ success: true, message: "Image deleted successfully" });
  } catch (error) {
    console.error("Error deleting image:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;
