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

        // Verify user is a member of the family
        const isMember = familyObj.members.some(member => member.user.toString() === user._id.toString());
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

export const getFamilyMemories = async (req, res) => {

    try {
        const { familyId } = req.params;

        const familyExists = await Family.findById({ _id: familyId });

        if (!familyExists) {
            return res.status(404).json({
                success: false,
                message: "Family not found"
            });
        }

        const memories = await Media.find({ family: familyId })
            .populate('uploadedBy', 'name email avatar')


        res.status(200).json({
            success: true,
            message: "Memories fetched successfully",
            data: memories
        });

    } catch (error) {
        console.error('[getFamilyMemories] Error:', error);
        console.error('[getFamilyMemories] Stack trace:', error.stack);

        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
};

export const deleteMemory = async (req, res) => {
    try {
        const { memoryId, userId } = req.params;

        if (!memoryId || !userId) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields"
            });
        }

        const memory = await Media.findById(memoryId);
        if (!memory) {
            return res.status(404).json({
                success: false,
                message: "Memory not found"
            });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        const family = await Family.findById(memory.family);
        if (!family) {
            return res.status(404).json({
                success: false,
                message: "Family not found"
            });
        }

        const isMember = family.members.some(member => member.user.toString() === user._id.toString());
        if (!isMember) {
            return res.status(403).json({
                success: false,
                message: "User is not a member of this family"
            });
        }

        if (memory.uploadedBy.toString() !== user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to perform this action"
            });
        }

        // Remove memoryId from family's memories array
        family.memories = family.memories.filter(memId => memId.toString() !== memoryId);
        await family.save();

        // Optional: Delete from cloud storage if needed
        // await deleteFromCloudinary(memory.mediaUrl); // Replace with your actual function

        // Delete memory document
        const deletedMemory = await Media.findByIdAndDelete(memoryId);

        return res.status(200).json({
            success: true,
            message: "Memory deleted successfully",
            deletedMemory,
        });

    } catch (error) {
        console.error("Error deleting memory:", error);
        return res.status(500).json({
            success: false,
            message: "Server error. Try again later.",
        });
    }
};


export const updateMemoryDescription = async (req, res) => {
    try {
        const { memoryId } = req.params;
        const { description } = req.body;

        const memory = await Media.findById(memoryId);
        if (!memory) {
            return res.status(404).json({
                success: false,
                message: "Memory not found"
            });
        }

        memory.description = description;
        await memory.save();

        return res.status(200).json({
            success: true,
            message: "Memory description updated successfully",
            data: memory
        });
    } catch (error) {
        console.error("Error updating memory description:", error);
        return res.status(500).json({
            success: false,
            message: "Server error. Try again later.",
            error: error.message
        });
    }
};