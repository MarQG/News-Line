const mongoose = require("mongoose");

const articlesSchema = mongoose.Schema(
        {
            title: {
                type: String,
                unique: true
            },
            link: String,
            description: String,
            saved: [{
                id: String
            }],
           
            notes: [{
                id: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Notes"
                },
            }]
    });



module.exports = mongoose.model("Articles", articlesSchema);