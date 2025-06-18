import JoinRequest from "../model/request.model.js";
import User from "../model/user.model.js";
import Family from "../model/family.model.js";

export const sendJoinRequest = async (req, res) => {
  const { from, to, familyId } = req.body;

  try {
    if (!from || !to || !familyId) {
      return res.status(400).json({ message: "All fields required" });
    }

    // Prevent duplicates
    const existingRequest = await JoinRequest.findOne({ from, to, family: familyId, status: "pending" });
    if (existingRequest) {
      return res.status(409).json({ message: "Join request already sent" });
    }

    const request = new JoinRequest({ from, to, family: familyId });
    await request.save();


    res.status(200).json({ message: "Join request sent", request });
  } catch (err) {
    res.status(500).json({ message: "Something went wrong", error: err.message });
  }
};



export const getAllJoinRequests = async (req, res) => {
  try {
    const { email } = req.params;
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ message: "User not found" });

    const requests = await JoinRequest.find({ to: user._id })
      .populate("from", "name email avatar")
      .populate("family", "name avatar description");

    return res.status(200).json({ requests });
  } catch (error) {
    console.error("Error fetching join requests:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const updateRequest = async (req, res) => {
  try {
    const { reqId, action } = req.body;
    const { email } = req.params;


    if (!reqId || !action) {
      return res.status(400).json({ message: "reqId and action are required" });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const request = await JoinRequest.findById(reqId);
    if (!request) return res.status(404).json({ message: "Request not found" });

    if (request.to.toString() !== user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to update this request" });
    }

    if (request.status !== "pending") {
      return res.status(400).json({ message: "Request already processed" });
    }

    if (action === "accepted") {
      request.status = "accepted";
      await request.save();

      const family = await Family.findById(request.family);

      if (!family) return res.status(404).json({ message: "Family not found" });

      if (!family.members.some(m => m.user.toString() === request.to.toString())) {
        family.members.push({
          user: request.to,
          role: "viewer",
          status: "approved",
          joinedAt: new Date()
        });
        await family.save();
      }


      return res.status(200).json({ message: "Request accepted", request });
    }

    if (action === "rejected") {
      request.status = "rejected";
      await request.save();
      return res.status(200).json({ message: "Request rejected", request });
    }

    return res.status(400).json({ message: "Invalid action" });

  } catch (error) {
    console.error("❌ Error in updateRequest:", error.message);
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};
