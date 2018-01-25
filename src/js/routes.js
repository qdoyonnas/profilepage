var express = require("express");
var User = require("../models/user.js");
var router = express.Router();

router.use(function(request, response, next) {
	response.locals.currentUser = request.user;
	response.locals.errors = request.flash("error");
	response.locals.infos = request.flash("info");
	next();
});

router.get("/", function(request, response, next) {
	User.find().sort({createdAt: "descending"}).exec(function(error, users) {
		if( error ) { return next(error); }
		
		response.render("index", {users: users});
	});
});

module.exports = router;