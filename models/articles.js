var mongoose = require("mongoose");

var articlesSchema = mongoose.Schema(
        {
            text: String,
            saved: Boolean,
            notes: [{
                id: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Notes"
                },
            }]
    });



module.exports = mongoose.model("Comment", articlesSchema);