const jwt = require("jsonwebtoken");
const User = require("../Modals/UserSchema");
require("dotenv").config();

async function requireSignIn(req, res, next) {
  try {
    const token = req.headers.authorization;
    if (!token) {
      return res.status(401).json({ success: false, message: "Access denied" });
    }

    const decoded = jwt.verify(
      token.replace("Bearer ", ""),
      process.env.JWT_SECRET
    );
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ success: false, message: "Invalid token" });
  }
}

module.exports = requireSignIn;
