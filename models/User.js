import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
	name: { type: String, required: true },
	email: { type: String, required: true, unique: true },
	password: { type: String, required: true },
	role: { type: String, enum: ["user", "admin"], default: "user" },
	points: { type: Number, default: 0 },
	status: { type: String, enum: ["active", "suspended"], default: "active" },
});

export default mongoose.models.User || mongoose.model("User", UserSchema);
