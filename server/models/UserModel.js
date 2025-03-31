import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  userId: String,
  userName: String,
  bestScore: Number
},
);

const User = mongoose.model("User", UserSchema);

export default User;
