const router = require('express').Router();
const User = require('../model/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {registerValidation, loginValidation} = require('./validation');


//REgister
router.post('/register', async (req, res) =>{

    //Validating data before creating user
    const {error} = registerValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    //check if user is already in database
    const emailExists = await User.findOne({email: req.body.email});
    if(emailExists) return res.status(400).send('Email already exists');

    //hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    //creating new user
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword
    });
        try{
            const savedUser = await user.save();
            res.send({user: user._id});
        }
        catch{
            err => res.status(400).send(err);
        }
    
});


//login
router.post('/login', async (req, res) => {
    //Validating data before logging in
    const {error} = loginValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    //check if email exists
    const user = await User.findOne({email: req.body.email});
    if(!user) return res.status(400).send('Email is not found');

    //check password
    const validPass = await bcrypt.compare(req.body.password, user.password);
    if(!validPass) return res.status(400).send('Invalid password');

    //create and assign a token
    const token = jwt.sign({
        name: user.name,
        _id: user._id,
        following: user.following
        
    }, process.env.TOKEN_SECRET);
    res.header('auth-token', token).send(token);

    //res.send('logged in');  

});


//follow push followers array on who to follow
router.post('/follow', (req, res) => {
    User.findByIdAndUpdate(req.body.to)
        .then( p => {
            p.followers.push(req.body.from);
            res.send('followed');

            p.save();
        })
        .catch(err => res.status(400).send(err));
});

//following push following array of logged user
router.post('/following', (req, res) => {
    User.findByIdAndUpdate(req.body.from)
        .then( q => {
        q.following.push(req.body.to);
        res.send('followed');

        q.save();
        })
        .catch(err => res.status(400).send(err));
});

//unfollow filter followers array of whom to unfollow
router.post('/unfollow', (req, res) => {
    User.findByIdAndUpdate(req.body.to)
        .then( p => {
            p.followers = p.followers.filter(el => el !== req.body.from);
            res.send('unfollowed');

            p.save();
        })
        .catch(err => res.status(400).send(err));
});

//unfollow filter following array of logged user
router.post('/unfollowing', (req, res) => {
    User.findByIdAndUpdate(req.body.from)
        .then( q => {
        q.following = q.following.filter(el => el !== req.body.to);
        res.send('unfollowed');

        q.save();
        })
        .catch(err => res.status(400).send(err));
});

//get all users
router.get('/allusers', (req, res) => {
    User.find()
        .then(users => res.send(users))
        .catch(err => res.status(400).send(err))
});

//get logged user
router.get('/loggeduser/:id', (req, res) => {
    User.findById(req.params.id)
        .then(user => res.send(user))
        .catch(err => res.status(400).send(err))
});
    

module.exports = router;