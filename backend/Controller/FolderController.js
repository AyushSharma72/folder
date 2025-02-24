const express = require("express");
const Folder = require("../Modals/FolderSchema");
const Image = require("../Modals/ImageFolder")
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

// Get Folders for Logged-in User (Only Parent Folders)
router.get("/", requireSignIn, async (req, res) => {
  try {
    const folders = await Folder.find({ user: req.user.id, parent: null });
    res.status(200).json(folders);
  } catch (error) {
    console.error("Fetch Folders Error:", error);
    res.status(500).json({ message: "Server error", error });
  }
});

router.get("/subfolders/:folderId", requireSignIn, async (req, res) => {
  try {
    const { folderId } = req.params;

    const subFolders = await Folder.find({
      user: req.user.id,
      parent: folderId,
    });

    res.status(200).json(subFolders);
  } catch (error) {
    console.error("Fetch Sub-Folders Error:", error);
    res.status(500).json({ message: "Server error", error });
  }
});

// delete the folder

router.delete("/:folderId", async (req, res) => {
  const { folderId } = req.params;

  try {
    const folder = await Folder.findById(folderId);
    if (!folder) {
      return res
        .status(404)
        .json({ success: false, message: "Folder not found" });
    }

    await Image.deleteMany({ folder: folderId });

    const deleteSubfolders = async (parentId) => {
      const subfolders = await Folder.find({ parent: parentId });

      for (const subfolder of subfolders) {
        await Image.deleteMany({ folder: subfolder._id }); 
        await deleteSubfolders(subfolder._id); 
        await Folder.findByIdAndDelete(subfolder._id); 
      }
    };

    await deleteSubfolders(folderId);

    await Folder.findByIdAndDelete(folderId);

    res.json({ success: true, message: "Folder and all its contents deleted" });
  } catch (error) {
    console.error("Error deleting folder:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;
