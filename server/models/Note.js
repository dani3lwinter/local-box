var mongoose = require('mongoose');

// Setup Note schema
var bookSchema = mongoose.Schema({
        title: {
            type: String,
            required: false
        },
        content: {
            type: String,
            required: true
        },
        destroyAt: {
            type: Date,
            default: null
        },
        isMainNote: {
            type: Boolean,
            default: false
        }
    },
    { timestamps: true });

// Export Note model
var Note = module.exports = mongoose.model('Note', bookSchema);

/*
module.exports.get = function (callback, limit) {
    Book.find(callback).limit(limit);
}*/