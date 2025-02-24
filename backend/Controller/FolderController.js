const express = require("express");
const Folder = require("../Modals/FolderSchema"); 
const requireSignIn = require("../middleware/authMiddleware");

const router = express.Router();

// Create Folder
router.post("/create", requireSignIn, async (req, res) => {
  try {
    const { name, parent } = req.body;

    if (!name)
      return res.status(400).json({ message: "Folder name is required" });

    const folder = await Folder.create({
      name,
      parent: parent || null,
      user: req.user.id,
    });

    res.status(201).json(folder);
  } catch (error) {
    console.error("Create Folder Error:", error);
    res.status(500).json({ message: "Server error", error });
  }
});

// Get Folders for Logged-in User
router.get("/", requireSignIn, async (req, res) => {
  try {
    const folders = await Folder.find({ user: req.user.id });

    res.status(200).json(folders);
  } catch (error) {
    console.error("Fetch Folders Error:", error);
    res.status(500).json({ message: "Server error", error });
  }
});

module.exports = router;
