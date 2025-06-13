const express = require('express');
const {
  handleImageUpload,
  updateProfile
} = require('../controllers/profile.controller');

const { upload } = require('../utils/cloudinary');

const router = express.Router();

router.post('/upload-image', upload.single("my_file"), handleImageUpload);
router.put('/update-profile', updateProfile);

module.exports = router;
