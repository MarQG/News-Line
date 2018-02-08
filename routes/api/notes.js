const express = require('express');
const router = express.Router();

const Notes = require("../../models/notes");
const Articles = require('../../models/articles');

router.post("/notes", (req, res) => {
    const newNote = {
        author: {
            id: req.user._id,
            username: req.user.username
        },
        comment: req.body.comment
    }
    Articles.findById(req.body.articleId).then((article) => {
        article.notes.push(newNote);
        article.save();
        res.json(article);
    });
});

router.get('/notes/:articleId', (req, res) => {
    Articles.findById(req.params.articleId).then((article) => {
        res.json({ article: article, user: req.user._id });
    }).catch((error) => {
        console.log(error);
        res.send("Something went wrong finding that article");
    });
});

router.delete('/notes/:commentId/:articleId', (req, res) => {
    Articles.findById(req.params.articleId).then((article) => {
        article.notes = article.notes.filter((note) => note._id != req.params.commentId);
        article.save();
        res.json(article);
    });
});

module.exports = router;