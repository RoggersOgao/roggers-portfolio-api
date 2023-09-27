import mongoose from "mongoose"

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
      required: true,
    },
    original_extension: {
      type: String,
      required: true,
    },
    bytes: {
      type: Number,
      required: true,
    },
  });
const DesignSchema = new mongoose.Schema({
    design:[uploadedFileSchema],
    description:{
        type:String,
        required:true,
        minLength: 10,
        maxLength: 100,
    }
},{timestamps:true})

const Design = mongoose.models.Design || mongoose.model("Design", DesignSchema)
module.exports = Design