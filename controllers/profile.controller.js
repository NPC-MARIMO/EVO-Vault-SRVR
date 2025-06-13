import { imageUploadUtil } from "../utils/cloudinary.js"; // <- MUST include .js
import User from '../model/user.model.js';

const handleImageUpload = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: "No file uploaded" });
        }

        const result = await imageUploadUtil(req.file.buffer, req.file.mimetype);

        return res.json({
            success: true,
            result,
        });
    } catch (error) {
        console.error("Upload Error:", error);
        return res.status(500).json({
            success: false,
            message: "Image upload failed",
        });
    }
};
const updateProfile = async (req, res) => {
  try {
    const { name, username, bio, email, avatar, password, confirmPassword } = req.body;
    // const userId = req.user?.id; // coming from auth middleware

    // if (!userId) {
    //   return res.status(401).json({ message: 'Unauthorized' });
    // }

    const user = await User.findOne(email);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Password validation
    if ((password && !confirmPassword) || (!password && confirmPassword)) {
      return res.status(400).json({ message: 'Both password and confirm password are required' });
    }

    if (password && confirmPassword && password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }

    // Update fields only if provided
    if (name) user.name = name;
    if (username) user.username = username;
    if (bio) user.bio = bio;
    if (avatar) user.avatar = { url: avatar }; // overwrite safely

    if (password && confirmPassword) {
      user.password = password; // Assuming hashing in schema pre-save hook
    }

    await user.save();
    return res.status(200).json({ message: 'Profile updated successfully' });


  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};


export { handleImageUpload, updateProfile };