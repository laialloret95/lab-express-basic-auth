const express = require('express');
const router = express.Router();
const bcryptjs = require('bcryptjs');
const UserModel = require('../models/User.model');
const mongoose = require('mongoose');
const saltRounds = 10;

router.get("/userProfile", (req, res) => {
    res.render('user/user-profile', { user: req.session.currentUser });
})

//SIGNUP
router.get('/signup', (req, res, next) => {
    res.render('auth/signup');
});

router.post("/signup", (req, res) => {
    const { username, password } = req.body;
    
    // Check all mandatory fields are passed
    if (!username || !password) {
        res.render('auth/signup', { errorMessage: 'Please fill all fields'});
        return
    }

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
        .catch(error => {
            // Input Format Validation
            if (error instanceof mongoose.Error.ValidationError) {
                res.status(500).render('auth/signup', { errorMessage: error.message });
            }
            // Unique Values Validation
            else if (error.code === 11000) {
                const errorMess = error.errmsg;
                const duplicatedField = errorMess.substring(
                    errorMess.lastIndexOf("{") + 1, 
                    errorMess.lastIndexOf("}")
                );
                res.status(500).render('auth/signup', { errorMessage: `${duplicatedField} already exists`});
            }
            else {
                next(error);
            }
        })
})

// LOGIN
router.get("/login", (req, res) => {
    res.render("auth/login");
})

router.post("/login", (req,res, next) => {
    const { username, password } = req.body;

    // Check user provided both fields
    if (!username || !password) {
     res.render("auth/login", {errorMessage: 'Please enter both email and password'})
     return;
    };

    // Check if user exists
    UserModel.findOne({username})
        .then(user => {
            if (!user) {
                res.render("auth/login", {errorMessage: 'Username not registered'})
                return;
            } else if (bcryptjs.compareSync(password, user.password)) {
                // Set Session when Login
                req.session.currentUser = user;
                return res.redirect("/userProfile")
            } else {
                res.render('auth/login', { errorMessage: 'Incorrect Passrod'});
            }
        })
        .catch( error => next(error))
});

router.post('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

module.exports = router;