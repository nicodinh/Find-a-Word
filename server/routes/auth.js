var express = require('express');
var router = express.Router();
var passport = require('passport');
var Account = require('../models/account');
var FawPlayer = require('../models/faw-player');
var flash  = require('connect-flash');
var session = require('express-session');

// login local
router.get('/', isNotLoggedIn, getUrlCallBack, function(req, res) {
    res.render('login', { user : req.user });
});

router.post('/', passport.authenticate('local', {
    successRedirect : '/profile', // redirect to the secure profile section
    failureRedirect : '/auth', // redirect back to the signup page if there is an error
    failureFlash : false // allow flash messages
}));

// inscription
router.get('/register', isNotLoggedIn, function(req, res) {
    res.render('register');
});

router.post('/register', function(req, res) {
    Account.register(new Account({ username : req.body.username }), req.body.password, function(err, account) {
        if (err) {
	    console.log("Utilisateur existant");
            return res.render('register', { account : account });
        }
	console.log("Nouvel utilisateur");
	res.redirect('/auth');
    });
});

// logout
router.get('/logout', function(req, res) {
    req.session.httpID = '';
    req.session.urlCallBack = '';
    req.logout();
    res.redirect('/');
});

// autres inscription
router.get('/twitter', isNotLoggedIn, function(req, res) {
    res.send('<!DOCTYPE html><html lang="en"><head><title>p2vid</title></head><body>'+
		'Twitter Auth</body></html>');
});
router.get('/facebook', isNotLoggedIn, function(req, res) {
    res.send('<!DOCTYPE html><html lang="en"><head><title>p2vid</title></head><body>'+
		'Facebook Auth</body></html>');
});

router.get('/google', isNotLoggedIn, function(req, res) {
    res.send('<!DOCTYPE html><html lang="en"><head><title>p2vid</title></head><body>'+
		'Google Auth</body></html>');
});

router.get('/github', isNotLoggedIn, function(req, res) {
    res.send('<!DOCTYPE html><html lang="en"><head><title>p2vid</title></head><body>'+
		'Github Auth</body></html>');
});

router.get('/steam', isNotLoggedIn, function(req, res) {
    res.send('<!DOCTYPE html><html lang="en"><head><title>p2vid</title></head><body>'+
		'Steam Auth</body></html>');
});

router.get('/twitch', isNotLoggedIn, function(req, res) {
    res.send('<!DOCTYPE html><html lang="en"><head><title>p2vid</title></head><body>'+
		'Twitch Auth</body></html>');
});

// route middleware to make sure a user is logged in
function isNotLoggedIn(req, res, next) {
    // if user is authenticated in the session, go out 
    if (req.isAuthenticated())
	res.redirect('/');
    // if they aren't go on
    return next();
}

function getUrlCallBack(req, res, next) {
    //console.log('je viens de '+ req.headers.referer);
    if (req.headers.referer.match(/demo\/find-a-word/g))
	req.session.urlCallBack = '/demo/find-a-word';
    return next();
}

module.exports = router;
