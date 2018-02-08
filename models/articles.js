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
            }]
    },{ usePushEach: true });



module.exports = mongoose.model("Articles", articlesSchema);