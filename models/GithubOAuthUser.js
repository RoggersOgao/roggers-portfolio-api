import mongoose from "mongoose"

const GithubOAuthUserSchema = new mongoose.Schema({
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
    type: {
        type: String,
        default: 'User'
    },
    site_admin: {
        type: Boolean,
        default: false
    },
    company: {
        type: String
    },
    blog: {
        type: String
    },
    location: {
        type: String
    },
    hireable: {
        type: Boolean,
        default: null
    },
    bio: {
        type: String
    },
    twitter_username: {
        type: String
    },
    public_repos: {
        type: Number,
        default: 0
    },
    public_gists: {
        type: Number,
        default: 0
    },
    total_private_repos:{
        type:Number,
        default:0
    },
    followers: {
        type: Number,
        default: 0
    },
    following: {
        type: Number,
        default: 0
    },
    image: {
        type: String,
        default: ""
    },
}, { timestamps: true }
)

const GithubOAuthUser = mongoose.models.GithubOAuthUser || mongoose.model("GithubOAuthUser", GithubOAuthUserSchema)
module.exports = GithubOAuthUser