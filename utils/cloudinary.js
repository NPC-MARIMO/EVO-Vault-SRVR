const cloudinary = require("cloudinary").v2;
const multer = require("multer");
require("dotenv").config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = multer.memoryStorage();
const upload = multer({ storage });

const imageUploadUtil = async (buffer, mimetype) => {
  const b64 = buffer.toString("base64");
  const dataURI = `data:${mimetype};base64,${b64}`;

  return await cloudinary.uploader.upload(dataURI, {
    resource_type: "auto",
  });
};


const videoUploadUtil = async (fileBuffer, mimeType) => {
    try {
        // Convert buffer to data URI
        const dataUri = `data:${mimeType};base64,${fileBuffer.toString('base64')}`;
        
        const uploadOptions = {
            resource_type: "video",
            chunk_size: 6000000, // 6MB chunks for large files
            eager: [
                { width: 300, height: 300, crop: "pad", audio_codec: "none" }, // thumbnail
                { quality: "auto", fetch_format: "auto" } // optimized version
            ],
            eager_async: true,
            folder: "family_memories/videos"
        };

        const result = await cloudinary.uploader.upload(dataUri, uploadOptions);
        
        return {
            url: result.secure_url,
            public_id: result.public_id,
            duration: result.duration,
            format: result.format,
            thumbnail: result.eager[0].secure_url // thumbnail URL
        };
    } catch (error) {
        console.error("Cloudinary Video Upload Error:", error);
        throw error;
    }
};

module.exports = { cloudinary, upload, imageUploadUtil, videoUploadUtil };
