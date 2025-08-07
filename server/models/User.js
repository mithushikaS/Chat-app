import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
    profilepic: {
    type: String,
    default: "",
  },
    bio: {
    type: String,
  },
},{
    timestamps : true,
});

const User = mongoose.model("User", userSchema);

export default User;
