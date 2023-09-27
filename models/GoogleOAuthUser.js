import mongoose from "mongoose"

const GoogleOAuthUserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minLength: 4,
        maxLength: 60,
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        match: /^\S+@\S+\.\S+$/,
    },
    locale: {
        type:String
    },
    image: {
        type: String,
        default: ""
    },
    role: {
        type: String,
        default: "user",
      },
}, { timestamps: true }
)

const GoogleOAuthUser = mongoose.models.GoogleOAuthUser || mongoose.model("GoogleOAuthUser", GoogleOAuthUserSchema)
module.exports = GoogleOAuthUser