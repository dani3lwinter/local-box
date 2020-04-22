var mongoose = require('mongoose');

// Setup File schema
var bookSchema = mongoose.Schema({
        originalname: {
            type: String,
            required: true
        },
        path: {
            type: String,
            required: true
        },
        size: {
            type: Number,
            required: true
        },
        mimetype: {
            type: String,
            required: false
        },
        encrypted: {
            type: Boolean,
            default: false
        },
        destroyAt: {
            type: Date,
            required: false
        }
    },
    { timestamps: true });

// Export File model
var File = module.exports = mongoose.model('File', bookSchema);
