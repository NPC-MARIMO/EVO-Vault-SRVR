import Media from "../model/media.model.js";
import User from "../model/user.model.js";
import Family from "../model/family.model.js";

export const createMemory = async (req, res) => {
    try {
        const { url, type, family, description, uploadedBy } = req.body;
        
        // Validation
        if (!url || !type || !family || !uploadedBy) {
            return res.status(400).json({ 
                success: false,
                message: "Missing required fields" 
            });
        }

        // Verify user exists
        const user = await User.findById(uploadedBy);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found" 
            });
        }

        // Verify family exists
        const familyObj = await Family.findById(family);
        if (!familyObj) {
            return res.status(404).json({
                success: false,
                message: "Family not found" 
            });
        }

        // Check if user is a member of the family
        const isMember = familyObj.members.some(member => 
            member.toString() === uploadedBy.toString()
        );
        
        if (!isMember) {
            return res.status(403).json({
                success: false,
                message: "User is not a member of this family"
            });
        }

        // Create and save memory
        const memory = new Media({ 
            url, 
            type, 
            family, 
            uploadedBy, 
            description: description || ""
        });
        
        await memory.save();

        // Add memory to family's memories array
        familyObj.memories.push(memory._id);
        await familyObj.save();

        res.status(201).json({
            success: true,
            message: 'Memory created successfully',
            data: memory
        });

    } catch (error) {
        console.error('Memory creation error:', error);
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
}