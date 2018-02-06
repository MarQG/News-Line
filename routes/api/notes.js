const express = require('express');
const router = express.Router();

const Notes = require("../../models/notes");

router.post("/notes", (req, res) => {
    console.log(req.body);
    const newNote = {
        author: {
            id: req.user._id,
            username: req.user.username
        },
        comment: req.body.comment,
        createdDate: 0
    }

    console.log(newNote);
    Notes.create(newNote, (error) => {
        if(error){
            console.log("Failed to create note because of :",error);
        }

        Notes.find({ "author.username" : req.user.username }, (error, results) => {
            if(error){
                return console.log("Something went wrong getting the notes we were looking for: ", error);
            }
            res.json(results);
    
        });
    });

    
});

module.exports = router;