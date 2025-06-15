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
    console.log("📥 Incoming request to fetch families for email:", email);

    const normalizedEmail = email.trim().toLowerCase();
    console.log("📧 Normalized email:", normalizedEmail);

    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      console.warn("⚠️ No user found with email:", normalizedEmail);
      return res.status(404).json({ message: "User not found" });
    }

    console.log("✅ User found:", {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
    });

    const userId = new mongoose.Types.ObjectId(user._id);
    console.log("🔑 Converted userId (ObjectId):", userId.toString());

    const families = await Family.find({
      "members.user": userId,
    })
      .populate("creator", "name email")
      .populate("members.user", "name email");

    console.log(`📦 Total families fetched for ${normalizedEmail}:`, families.length);
    families.forEach((fam, i) => {
      console.log(`  #${i + 1}: ${fam.name} | Members: ${fam.members.length}`);
      fam.members.forEach((m, j) => {
        console.log(
          `    → Member ${j + 1}: ${m.user?.name || 'N/A'} (${m.user?.email || 'N/A'}) | Role: ${m.role} | Status: ${m.status}`
        );
      });
    });

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
      .populate("members.user", "name email");
    if (!family) {
      return res.status(404).json({ message: "Family not found" });
    }
    return res.status(200).json(family);
  } catch (err) {
    console.error("Error fetching family:", err);
    return res.status(500).json({ message: "Server error" });
  }
}; 

export { createFamily, fetchFamilies, getParticularFamily };
