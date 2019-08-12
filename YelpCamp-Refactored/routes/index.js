const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/user");
const Campground = require("../models/campground");

// root route
router.get("/", (req, res) => {
	res.render("landing");
});

// show register form
router.get("/register", (req, res) => {
	res.render("register", {page: "register"});
});

// handle sign up logic
router.post("/register", (req, res) => {
	var newUser = new User(
		{
			username: req.body.username, 
			firstName: req.body.firstName, 
			lastName: req.body.lastName, 
			email: req.body.email,
			avatar: req.body.avatar
		}
	);
	if (req.body.adminCode === 'secretcode123') {
		newUser.isAdmin = true;
	}
	User.register(newUser, req.body.password, (err, user) => {
		if (err) {
			return res.render("register", {"error": err.message});
		}
		passport.authenticate("local")(req, res, () => {
			req.flash("success", "Wlecome to YelpCamp " + user.username);
			res.redirect("/campgrounds");
		});
	});
});

// show login form
router.get("/login", (req, res) => {
	res.render("login", {page: "login"});
});
// handling login logic
router.post("/login", passport.authenticate("local", {successRedirect: "/campgrounds", failureRedirect: "/login", failureFlash: true}), (req, res) => {
	
});

// logout route
router.get("/logout", (req, res) => {
	req.logout();
	req.flash("success", "You've logged out!");
	res.redirect("/campgrounds");
});

// user profile
router.get("/users/:id", function(req, res){
	User.findById(req.params.id, function(err, foundUser){
		if (err) {
			req.flash("error", "Something went wrong");
			res.redirect("/");
		}
		Campground.find().where('author.id').equals(foundUser._id).exec(function(err, campgrounds) {
			if (err) {
				req.flash("error", "Something went wrong");
				res.redirect("/");
			}
			res.render("users/show", {user: foundUser, campgrounds: campgrounds});
		})
	})
})

module.exports = router;