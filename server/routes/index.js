var express = require('express');
var router = express.Router();
//var util = require('util');

router.get('/', function(req, res) {
  res.render('index-acceuil');
});

router.get('/about', function(req, res) {
    res.render('about', {
		originalUrl : req.originalUrl
    });
});

router.get('/references', function(req, res) {
    //console.log("PAGE = " + util.inspect(req));
    //console.log("PAGE = " + req.originalUrl.substring(1, req.originalUrl.length));
    res.render('references', {
		originalUrl : req.originalUrl
    });
});

router.get('/profile', isLoggedIn, function(req, res) {
    res.render('profile', { urlCallBack : req.session.urlCallBack });
});

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {
    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
	return next();
    // if they aren't redirect them to the home page
    res.redirect('/');
}

module.exports = router;