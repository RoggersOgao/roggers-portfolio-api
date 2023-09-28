import mongoose from "mongoose";

const uploadedFileSchema = new mongoose.Schema(
  {
    public_id: {
      type: String,
    },
    secure_url: {
      type: String,
    },
    original_filename: {
      type: String,
    },
    original_extension: {
      type: String,
    },
    bytes: {
      type: Number,
    },
  });

const ProjectSchema = new mongoose.Schema(
  {
    projectName: {
      type: String,
      required: true,
      unique:true
    },
    projectDescription: {
      type: String,
      required: true,
    },
    technologies: [
    {
      value: Number,
      label: String,
    },
  ],
    projectLink: {
      type: String,
      unique:true
    }, // Assuming "form.projectLink" is a string
    coverPhoto: [uploadedFileSchema],
    projectPhoto: [uploadedFileSchema],
  },
  { timestamps: true }
);

const Project = mongoose.models.Project || mongoose.model("Project", ProjectSchema);
module.exports = Project;
