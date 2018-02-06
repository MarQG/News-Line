const mongoose = require('mongoose');

const notesSchema = mongoose.Schema({
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: {
            type: mongoose.Schema.Types.String,
            ref: "User"
        }
    },
    comment: {
        type: String,
        required: true
    },
    createdDate: {
        type: Number,
        timestamps: true

    }

});

module.exports = mongoose.model("Notes", notesSchema);