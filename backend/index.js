const express = require("express");
const connectDB = require("./DbConnect");
require("dotenv").config();
const cors = require("cors"); 
const userRoutes = require("./Controller/UserController");
const FolderRoutes = require("./Controller/FolderController");
const ImageRoutes = require("./Controller/ImageController");
const app = express();
connectDB();
app.use(express.json());
app.use(cors());
app.use("/api/auth", userRoutes);
app.use("/api/folder", FolderRoutes);
app.use("/api/image", ImageRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
