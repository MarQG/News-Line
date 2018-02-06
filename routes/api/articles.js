const express           = require("express");
const router            = express.Router();
const cheerio           = require('cheerio');
const request           = require("request");
const Articles          = require('../../models/articles');

// ===== Scapper Functions ======
const scrapeHuffPost = (req, res) => {
    const  siteURL = 'https://www.huffingtonpost.com';
    request(siteURL, (error, response, html)=> {
        let headlineTags = '';
        let linkTags = '';
        let headlineDescTags = '';
        const $ = cheerio.load(html);

        let results = [];

        $('a.bn-card-headline').each((i, element) => {
            headlineTags = $(element).text();
            headlineTags = headlineTags.replace(/\r?\n|\r/, '');
            linkTags = $(element).attr('href');
            if(linkTags[0] === '/'){
                linkTags = siteURL + linkTags;
            }
            results.push({
                title: headlineTags,
                link: linkTags,
                description: headlineDescTags,
            });
        });
        Articles.create(results, (error, articles)=>{
            if(error){
                console.log("Duplicate Item Found: ", error.message);
                req.flash('error', 'Nothing New to add.');
            }
            res.json(articles)
        });
    });
}

const scrapeNYT = (req, res) => {
    const  siteURL = 'https://www.nytimes.com/';
    request(siteURL, (error, response, html)=> {
        let headlineTags = '';
        let linkTags = '';
        let headlineDescTags = '';
        const $ = cheerio.load(html);

        let results = [];

        $('h2.story-heading').each((i, element) => {
            headlineTags = $(element).children('a').text().replace(/\r?\n|\r/g,'').trim();
            linkTags = $(element).children('a').attr('href');
            if(headlineTags != ''){
                results.push({
                    title: headlineTags,
                    link: linkTags,
                    description: ''
                });
            }
        });
        console.log(results);
        Articles.create(results, (error, articles)=>{
            if(error){
                console.log("Duplicate Item Found: ", error.message);
                req.flash('error', 'Nothing new to add.');
            }
            res.json(articles);
        });
    });
}


// ====== ROUTES ========
router.get('/articles', (req, res) => {
    Articles.find({}).limit(50).then((results) => {   
        res.json(results);
    }).catch((error) => {
        if(error){
            req.flash('error', 'Something went wrong with the database. Try again later.');
            return console.log("Could not pull from database: ", error);
        }
    });
});

router.post('/articles', (req, res) => {
    
    switch(req.body.select){
        case "1":
            scrapeHuffPost(req, res);
            break;
        case "2":
            scrapeNYT(req, res);
            break;
        default:
            req.flash('error', 'Sorry something went wrong with the scrape.');
            break;
    }
});

router.post('/saveArticles/', (req, res)  => {
   Articles.findById(req.body.articleId).then((article) => {

        const articleCount = article.saved.filter( (e) => {

            return JSON.stringify(e.id) === JSON.stringify(req.user._id);
        });
        if(articleCount.length > 0){
            console.log('User already saved this');
        } else {
            Articles.findByIdAndUpdate(req.body.articleId,{ $push: { saved: { id:req.user._id} }}, (err, results) => {
                if(err){
                    return console.log(err);
                }
                console.log("saved article for user");
                console.log(results);
            })
          
        }
   }).catch((error) => {
       if(error){
           console.log('Unable to find that item', error);
           req.flash('error', 'Sorry something went wrong with database.');
       }
   });
});

router.get('/savedArticles/', (req, res) => {
    Articles.find({
        'saved.id': { $all: [ req.user._id ]}
    }).then((results) => {
        res.json(results);
    }).catch((error) => {
        console.log(error);
    })

});


module.exports = router;