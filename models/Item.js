import mongoose from "mongoose";

const ItemSchema = new mongoose.Schema({
	title: { type: String, required: true },
	description: { type: String, required: true },
	category: { type: String, required: true },
	image: { type: String }, // base64 string
	owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
	status: {
		type: String,
		enum: ["available", "swapped", "pending"],
		default: "available",
	},
	createdAt: { type: Date, default: Date.now },
	updatedAt: { type: Date, default: Date.now },
	isApproved: { type: Boolean, default: false },
	isVisible: { type: Boolean, default: false },
});

export default mongoose.models.Item || mongoose.model("Item", ItemSchema);
