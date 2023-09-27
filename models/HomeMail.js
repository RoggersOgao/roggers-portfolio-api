import mongoose from 'mongoose';

const HomeMailSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        maxLength: [60, 'Name cannot exceed 60 characters'],
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        match: /^\S+@\S+\.\S+$/,
        unique: false,
    },
    message: {
        type: String,
        required: true,
        minLength: 10, // Minimum length of the message
        maxLength: 1000, // Maximum length of the message
    }
}, { timestamps: true });

const HomeMail = mongoose.models.HomeMail || mongoose.model('HomeMail', HomeMailSchema);

export default HomeMail;