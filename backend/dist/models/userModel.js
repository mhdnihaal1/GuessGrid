import mongoose, { Schema } from "mongoose";
const userSchema = new Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    score: { type: String, default: "", required: false },
});
export default mongoose.model("User", userSchema);
