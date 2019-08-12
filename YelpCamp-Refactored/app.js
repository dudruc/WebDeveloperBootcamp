const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const flash = require("connect-flash");
const passport = require("passport");
const moment = require("moment");
const localStrategy = require("passport-local");
const methodOverride = require("method-override");
const Campground = require("./models/campground");
const Comment = require("./models/comment");
const User = require("./models/user");
const seedDB = require("./seeds");

// requiring routes
const commentRoutes = require("./routes/comments");
const campgroundRoutes = require("./routes/campgrounds");
const indexRoutes = require("./routes/index");

var url = process.env.DATABASEURL || "mongodb://localhost:27017/yelp_camp";

//mongoose.connect("mongodb+srv://steve:web5433@cluster0-gjjdt.mongodb.net/yelp_camp?retryWrites=true&w=majority", {
// mongoose.connect(url, {
// 	useNewUrlParser: true,
// 	useCreateIndex: true
// }).then(() => {
// 	console.log("Connected to DB!");
// }).catch( err => {
// 	console.log('ERROR', err.message);
// });

mongoose.connect("mongodb://localhost:27017/yelp_camp", { useNewUrlParser: true });
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
// seedDB(); // seed the database

// PASSPORT CONFIGURATION
app.use(require("express-session")({
	secret:"I have a secret",
	resave: false,
	saveUninitialized: false
}));

app.locals.moment = require('moment');
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});

// Campground.create(
// 	{
// 		name: "Jiangsu",
// 		image: "https://farm1.staticflickr.com/60/215827008_6489cd30c3.jpg",
// 		description: "This is a huge granite hill, no bathrooms. No water. Beautiful granite!",
// 	}, 
// 	function(err, campground) {
// 	if(err){
// 		console.log(err);
// 	} else {
// 		console.log("NEWLY CREATED CAMPGROUND: ");
// 		console.log(campground);
// 	}
// });

// var campgrounds = [
// 		{name: "Hunan", image: "https://farm9.staticflickr.com/8442/7962474612_bf2baf67c0.jpg"},
// 		{name: "Jiangsu", image: "https://farm1.staticflickr.com/60/215827008_6489cd30c3.jpg"},
// 		{name: "Melbourne", image: "https://farm7.staticflickr.com/6057/6234565071_4d20668bbd.jpg"}
// 	];

app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

app.listen(3000, process.env.IP, function(){
	console.log("YelpCamp Server Has Started!");
});