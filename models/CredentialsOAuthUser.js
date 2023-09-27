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
    maxLength:60
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

const CredentialsOAuthUserSchema = new mongoose.Schema(
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
    password: {
      type: String,
      minlength: 8,
      maxlength: 100,
    },
    image: {
      type: String
    },
    socials: [socialSchema],
    personalInfo:[personalSchema],
    role: {
      type: String,
      default: "admin",
    },
  },
  { timestamps: true }
);

const CredentialsOAuthUser = mongoose.models.CredentialsOAuthUser || mongoose.model("CredentialsOAuthUser", CredentialsOAuthUserSchema);
module.exports = CredentialsOAuthUser;
