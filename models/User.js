import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
	username: { type: String, required: true, unique: true },
	name: { type: String },
	email: { type: String, required: true, unique: true },
	password: { type: String, required: true },
	role: { type: String, enum: ["user", "admin"], default: "user" },
	points: { type: Number, default: 2 },
	status: { type: String, enum: ["active", "suspended"], default: "active" },
});

export default mongoose.models.User || mongoose.model("User", UserSchema);
