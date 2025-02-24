const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    image: {
      data: Buffer,
      contentType: String,
    },
    folder: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Folder",
      required: true,
    },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

const Image = mongoose.model("Image", imageSchema);
module.exports = Image;
