const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: 6,
        select: false, // Prevent password from being sent in queries
    },
    avatar: {
        public_id: String,
        url: {
            type: String,
            default: '', // Optional fallback image
        },
    },
    families: [
        {
            family: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Family',
            },
            role: {
                type: String,
                enum: ['Admin', 'Editor', 'Viewer'],
                default: 'Viewer',
            },
        },
    ],
    bio : {
        type : String,
        maxlength : 200,
    },
    isVerified : {
        type : Boolean,
        default : false,
    },
        
})