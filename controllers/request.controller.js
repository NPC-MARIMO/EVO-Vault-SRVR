import JoinRequest from "../model/joinRequest.model.js";
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

    const request = await new JoinRequest({ from, to, family: familyId });
    res.status(201).json({ message: "Join request sent", request });
  } catch (err) {
    res.status(500).json({ message: "Something went wrong", error: err.message });
  }
};
