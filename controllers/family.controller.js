import mongoose from "mongoose"; // ✅ Needed for ObjectId
import Family from "../model/family.model.js";
import User from "../model/user.model.js";
const createFamily = async (req, res) => {
  try {
    const { name, avatar, description, joinPolicy, email } = req.body;

    if (!name || !avatar || !description || !joinPolicy || !email) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const creator = await User.findOne({ email });
    if (!creator) {
      return res.status(404).json({ message: "Creator not found" });
    }

    const family = new Family({
      name,
      avatar,
      description,
      joinPolicy,
      creator: creator._id,
      members: [
        {
          user: creator._id,
          role: "admin",
          status: "approved",
        },
      ],
    });

    await family.save(); // 🛠️ DON'T forget this

    creator.families.push(family._id);
    await creator.save();

    res.status(200).json({
      message: "Family created successfully",
      family,
    });
  } catch (error) {
    console.error("Error creating family:", error);
    res.status(500).json({ message: "Server error, try again later" });
  }
};
const fetchFamilies = async (req, res) => {
  try {
    const { email } = req.params;

    const normalizedEmail = email.trim().toLowerCase();

    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    

    const userId = new mongoose.Types.ObjectId(user._id);

    const families = await Family.find({
      "members.user": userId,
    })
      .populate("creator", "name email")
      .populate("members.user", "name email");


    return res.status(200).json(families);
  } catch (err) {
    console.error("❌ Error fetching user families:", err);
    return res.status(500).json({ message: "Server error" });
  }
};


const getParticularFamily = async (req, res) => {
  try {
    const { familyId } = req.params;
    const family = await Family.findById(familyId)
      .populate("creator", "name email")
      .populate("members.user", "name email avatar");
    if (!family) {
      return res.status(404).json({ message: "Family not found" });
    }
    return res.status(200).json(family);
  } catch (err) {
    console.error("Error fetching family:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

const deleteFamilyMember = async (req, res) => {
  try {
    const { familyId, memberId } = req.params;
    if (!familyId || !memberId) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const family = await Family.findById(familyId);
    if (!family) {
      return res.status(404).json({ message: "Family not found" });
    }

    if (family.members.role === "admin") {
      return res.status(403).json({ message: "You are not authorized to perform this action" });
    }

    const memberIndex = family.members.findIndex(member =>
      member.user.toString() === memberId
    );

    if (memberIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "User is not a member of this family"
      });
    }

    family.members.splice(memberIndex, 1);
    await family.save();

    return res.status(200).json({
      success: true,
      message: "User removed from family successfully",
      data: family
    });

  } catch (error) {
    console.error("Error deleting family member:", error);
    return res.status(500).json({ message: "Server error" });
  }
}

const updateMemberRole = async (req, res) => {
  try {
    const { familyId, memberId } = req.params;
    const { role } = req.body;
    

    if (!familyId || !memberId || !role) {
      return res.status(400).json({
        success: false,
        message: "All fields are required (familyId, memberId, role)"
      });
    }

    const validRoles = ['admin', 'viewer'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role specified"
      });
    }

    const family = await Family.findById(familyId);
    if (!family) {
      return res.status(404).json({
        success: false,
        message: "Family not found"
      });
    }

    const userExists = await User.exists({ _id: memberId });
    if (!userExists) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    const memberIndex = family.members.findIndex(
      member => member.user.toString() === memberId
    );

    if (memberIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "The selected member is not part of this family"
      });
    }

    const adminMembers = family.members.filter(m => m.role === 'admin');
    const isLastAdmin = adminMembers.length === 1 &&
      family.members[memberIndex].role === 'admin';

    if (isLastAdmin && role !== 'admin') {
      return res.status(400).json({
        success: false,
        message: "Cannot remove the last admin of the family"
      });
    }

    family.members[memberIndex].role = role;
    await family.save();

    return res.status(200).json({
      success: true,
      message: "Member role updated successfully",
      data: {
        familyId: family._id,
        memberId,
        newRole: role
      }
    });

  } catch (error) {
    console.error("Error updating member role:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

const updateFamilyDetails = async (req, res) => {
  try {
    const { familyId } = req.params;
    const { name, avatar, description, joinPolicy } = req.body.formData;
    console.log(name, avatar, description, joinPolicy);
    

    const family = await Family.findById(familyId);
    if (!family) {
      return res.status(404).json({
        success: false,
        message: "Family not found"
      });
    }

    family.name = name || family.name;
    family.avatar = avatar || family.avatar;
    family.description = description || family.description;
    family.joinPolicy = joinPolicy || family.joinPolicy;

    await family.save();

    return res.status(200).json({
      success: true,
      message: "Family details updated successfully",
      data: family
    });

  } catch (error) {

    console.error("Error updating family details:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
    
  }
}

export { createFamily, fetchFamilies, getParticularFamily, deleteFamilyMember, updateMemberRole, updateFamilyDetails };
