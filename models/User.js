import mongoose from "mongoose";

const socialSchema = new mongoose.Schema({
  linkedIn: {
    type: String,
  },
  twitter: {
    type: String,
  },
  instagram: {
    type: String,
  },
  facebook: {
    type: String,
  },
  github: {
    type: String,
  },
});

const personalSchema = new mongoose.Schema({
  location: {
    type: String,
    maxLength:60,
  },
  company: {
    type: String,
    maxLength: 60,
  },
  bio: {
    type: String,
    maxLength: 600,
  },
});

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      maxLength: 60,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      match: /^\S+@\S+\.\S+$/,
    },
    image: {
      type: String,
    },
    socials: [socialSchema],
    personalInfo: [personalSchema],
    role: {
      type: String,
    },
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model("User", UserSchema);
module.exports = User;
