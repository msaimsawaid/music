const mongoose = require('mongoose');

const albumSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    artist: {
        type: String,
        required: true,
        trim: true
    },
    releaseDate: {
        type: Date,
        default: Date.now
    },
    genre: {
        type: String,
        trim: true
    },
    coverImage: {
        type: String, // URL or path to image
        default: ''
    },
    description: {
        type: String,
        trim: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});

// Index for search
albumSchema.index({ title: 'text', artist: 'text', genre: 'text' });

module.exports = mongoose.model('Album', albumSchema);
