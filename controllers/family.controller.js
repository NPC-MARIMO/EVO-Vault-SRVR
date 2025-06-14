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
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ message: "User not found" });

    const families = await Family.find({
      members: {
        $elemMatch: {
          user: user._id,
          status: 'approved',
        },
      },
    })
      .populate("creator", "name email")
      .populate("members.user", "name email")
    //   .populate("vaults");

    return res.status(200).json(families);
  } catch (err) {
    console.error("Error fetching user families:", err);
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
