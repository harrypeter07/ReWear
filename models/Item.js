import mongoose from "mongoose";

const ItemSchema = new mongoose.Schema({
	title: { type: String, required: true },
	description: { type: String, required: true },
	category: { type: String, required: true },
	image: { type: String },
	owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
	status: {
		type: String,
		enum: ["available", "swapped", "pending"],
		default: "available",
	},
});

export default mongoose.models.Item || mongoose.model("Item", ItemSchema);
