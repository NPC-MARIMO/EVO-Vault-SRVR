import jwt from 'jsonwebtoken';
import User from '../model/user.model.js';

const authMiddleware = async (req, res, next) => {
  try {
    // Check for token in cookies
    let token = req.cookies?.token;

    // If not in cookies, check Authorization header
    if (!token && req.headers.authorization?.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({ message: "Unauthorized: User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Auth Middleware Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export { authMiddleware };
