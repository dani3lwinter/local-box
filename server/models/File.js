var mongoose = require('mongoose');

// Setup File schema
var fileSchema = mongoose.Schema({
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
        authTag: {
            type: Buffer,
            required: false
        },
        destroyAt: {
            type: Date,
            required: false
        }
    },
    { timestamps: true });

// Export File model

// Overide toJSON 
fileSchema.methods.toJSON = function() {
    var obj = this.toObject();
    // remove authTag property so it wont get to the client
    delete obj.authTag;
    return obj;
}

var File = module.exports = mongoose.model('File', fileSchema);
