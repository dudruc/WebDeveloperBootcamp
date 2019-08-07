const express = require("express");
const app = express();
const mongoose = require("mongoose");
const passport = require("passport");
const bodyParser = require("body-parser");
const localStrategy = require("passport-local");
const passportLocalMongoose = require("passport-local-mongoose");
const User = require("./models/user");


mongoose.connect("mongodb://localhost:27017/auth_app", { useNewUrlParser: true });
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));

app.use(require("express-session")({
	secret: "thank u next",
	resave:false,
	saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//===========
// ROUTES
//===========

app.get("/", (req, res) => {
	res.render("home");
});

app.get("/secret", isLoggedIn, (req, res) => {
	res.render("secret");
});

// Auth Routes
// show sign up form
app.get("/register", (req, res) => {
	res.render("register");
});
// handling user sign up
app.post("/register", (req, res) => {
	User.register(new User({username: req.body.username}), req.body.password, (err, user) => {
		if (err) {
			console.log(err);
			return res.render('register');
		}
		passport.authenticate("local")(req, res, () => {
			res.redirect("/secret");
		});
	});
});

// LOGIN ROUTES
// render login form
app.get("/login", (req, res) => {
	res.render("login");
});
// login logic
app.post("/login", passport.authenticate("local", {
	successRedirect: "/secret",
	failureRedirect: "/login"
}), (req, res) => {

});

app.get("/logout", (req, res) => {
	req.logout();
	res.redirect("/");
});

function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
}

app.listen(3000, function(){
	console.log("server started.......");
});