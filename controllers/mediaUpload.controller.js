
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


const handleVideoUpload = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ 
                success: false, 
                message: "No file uploaded" 
            });
        }

        // Validate video file type
        const validVideoTypes = [
            'video/mp4',
            'video/webm',
            'video/ogg',
            'video/quicktime',
            'video/x-msvideo'
        ];
        
        if (!validVideoTypes.includes(req.file.mimetype)) {
            return res.status(400).json({
                success: false,
                message: "Invalid video format. Supported formats: MP4, WebM, Ogg, QuickTime, AVI"
            });
        }

        // Validate file size (e.g., 50MB limit)
        const maxSize = 50 * 1024 * 1024; // 50MB
        if (req.file.size > maxSize) {
            return res.status(400).json({
                success: false,
                message: "Video file too large. Maximum size is 50MB"
            });
        }

        const result = await videoUploadUtil(req.file.buffer, req.file.mimetype);

        return res.json({
            success: true,
            result,
        });
    } catch (error) {
        console.error("Video Upload Error:", error);
        return res.status(500).json({
            success: false,
            message: "Video upload failed",
            error: error.message
        });
    }
};

export { handleImageUpload, handleVideoUpload };