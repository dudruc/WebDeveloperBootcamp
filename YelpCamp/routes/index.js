const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/user");

// root route
router.get("/", (req, res) => {
	res.render("landing");
});

// show register form
router.get("/register", (req, res) => {
	res.render("register");
});

// handle sign up logic
router.post("/register", (req, res) => {
	var newUser = new User({username: req.body.username});
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
	res.render("login");
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

module.exports = router;