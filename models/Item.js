import mongoose from "mongoose";

const ItemSchema = new mongoose.Schema({
	title: { type: String, required: true },
	description: { type: String, required: true },
	category: { type: String, required: true },
	image: { type: String, required: true }, // URL string, required
	owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
	pointsValue: { type: Number, required: true },
	status: {
		type: String,
		enum: ["available", "swapped", "pending", "redeemed"],
		default: "available",
	},
	createdAt: { type: Date, default: Date.now },
	updatedAt: { type: Date, default: Date.now },
	isApproved: { type: Boolean, default: false },
	isVisible: { type: Boolean, default: false },
});

export default mongoose.models.Item || mongoose.model("Item", ItemSchema);
