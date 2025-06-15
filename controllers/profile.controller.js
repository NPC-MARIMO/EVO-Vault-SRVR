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

        const user = await User.findOne({ email }); // ✅ CORRECTED

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if ((password && !confirmPassword) || (!password && confirmPassword)) {
            return res.status(400).json({ message: 'Both password and confirm password are required' });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({ message: 'Passwords do not match' });
        }

        if (name) user.name = name;
        if (username) user.username = username;
        if (bio) user.bio = bio;
        if (avatar) user.avatar = { url: avatar };
        if (password) user.password = password;

        await user.save();
        return res.status(200).json({ message: 'Profile updated successfully' });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
};

const getParticularUser = async (req, res) => {
  try {
    const { search } = req.query; // 👈 Not req.body

    let user = await User.findOne({ email: search });
    if (!user) {
      user = await User.findOne({ username: search });
    }

    if (!user) {
      return res.status(404).json({ message: "User Not Found" });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};


export { handleImageUpload, updateProfile, getParticularUser };