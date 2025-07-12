import mongoose from "mongoose";

const SwapRequestSchema = new mongoose.Schema({
	item: { type: mongoose.Schema.Types.ObjectId, ref: "Item", required: true },
	requester: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
	type: { type: String, enum: ["swap", "redeem"], required: true },
	status: {
		type: String,
		enum: ["pending", "accepted", "rejected"],
		default: "pending",
	},
	message: { type: String },
	createdAt: { type: Date, default: Date.now },
	resolvedAt: { type: Date },
});

export default mongoose.models.SwapRequest ||
	mongoose.model("SwapRequest", SwapRequestSchema);
