const router = require('express').Router();
const Posts = require('../model/Posts');
const verify = require('./verifyToken');

//get secure data
router.get('/', verify, (req, res) => {
    res.send(req.user);
});

//creating a post
router.post('/update/:id', (req, res) => {

    const newPost = new Posts({
        description: req.body.description,
        ownerid: req.body.ownerid,
        ownername: req.body.ownername,
        imageName: req.body.imageName,
        imageData: req.body.imageData
    });

    newPost.save()
        .then(() => res.send('post added!'))
        .catch(err => res.status(400).send('Error: ' + err))


    // User.findByIdAndUpdate(req.params.id)
    //     .then( p => {
    //         p.posts.push(req.body);
    //         res.send('posted');

    //         p.save();
    //     })
    //     .catch(err => res.status(400).send(err))
});

//get myposts
router.get('/myposts/:ownerid', (req, res) => {
    Posts.find({ $or: [{ ownerid: req.params.ownerid }] })
        .then(posts => res.send(posts))
        .catch(err => res.send("error: " + err))
});

//delete myposts
router.delete('/myposts/delete/:id', (req, res) => {
    Posts.findByIdAndDelete(req.params.id)
        .then(posts => res.send(posts))
        .catch(err => res.send("delete error: " + err))
});

//get newsfeed
router.post('/newsfeed', (req, res) => {
    const arr = req.body.myfollowing.map(c => ({ ownerid: c }));
    if (arr.length > 0) {
        Posts.find({ $or: arr })
            .then(posts => res.send(posts))
            .catch(err => {
                console.log(err);
                res.status(400).send("fetch following err:" + err)
            })
    } else {
        res.send([]);
    }
});


module.exports = router;