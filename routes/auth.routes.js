const express = require('express');
const router = express.Router();
const bcryptjs = require('bcryptjs');
const UserModel = require('../models/User.model');
const saltRounds = 10;

/* GET home page */
router.get('/signup', (req, res, next) => {
    res.render('auth/signup');
});

router.get("/userProfile", (req, res) => {
    res.render('user/user-profile');
})

router.post("/signup", (req, res) => {
    const { username, password } = req.body;
    
    bcryptjs
        .genSalt(saltRounds)
        .then(salt => bcryptjs.hash(password, salt))
        .then(hashedPassword => {
            return UserModel.create({ username, password: hashedPassword})
        })
        .then(userCreated => {
            console.log(userCreated);
            res.redirect("/userProfile");
        })
})

module.exports = router;
