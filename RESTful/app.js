const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const expressSanitizer = require("express-sanitizer");

// APP CONFIG
mongoose.connect("mongodb://localhost:27017/restful_blog_app", { useNewUrlParser: true });
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));

// MONGOOSE/MODEL CONFID
var blogSchema = new mongoose.Schema({
	title: String,
	image: String,
	body: String,
	created: {type: Date, default: Date.now},
});
var Blog = mongoose.model("Blog", blogSchema);

// Blog.create({
// 	title: "Test Blog",
// 	image: "https://images.unsplash.com/photo-1537151672256-6caf2e9f8c95?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=933&q=80",
// 	body: "HELLO THIS IS A BLOG POST!",
// });

//RESTFUL ROUTES
app.get("/", (req, res) => {
	res.redirect("/blogs");
});

// INDEX ROUTE
app.get("/blogs", (req, res) => {
	Blog.find({}, (err, blogs) => {
		if (err) {
			console.log("ERROR!");
		} else {
			res.render("index", {blogs: blogs});
		}
	});
});

// NEW ROUTE
app.get("/blogs/new", (req, res) => {
	res.render("new");
});

// CREATE ROUTE
app.post("/blogs", (req, res) => {
	// create blog
	// console.log(req.body.blog.body);
	req.body.blog.body = req.sanitize(req.body.blog.body);
	// console.log("================");
	// console.log(req.body.blog.body);
	Blog.create(req.body.blog, (err, newBlog) => {
		if(err) {
			res.render("new");
		} else {
			// then, redirect to the index
			res.redirect("/blogs");
		}
	});
});

// SHOW ROUTE
app.get("/blogs/:id", (req, res) =>{
	Blog.findById(req.params.id, (err, foundBlog) => {
		if (err) {
			res.redirect("/blogs");
		} else {
			// render show template with that campground
			res.render("show", {blog: foundBlog});
		}
	});
});

// EDIT ROUTE
app.get("/blogs/:id/edit", (req, res) =>{
	Blog.findById(req.params.id, (err, foundBlog) => {
		if (err) {
			res.redirect("/blogs");
		} else {
			// render show template with that campground
			res.render("edit", {blog: foundBlog});
		}
	});
});

// UPDATE ROUTE
app.put("/blogs/:id", (req, res) => {
	req.body.blog.body = req.sanitize(req.body.blog.body);
	Blog.findByIdAndUpdate(req.params.id, req.body.blog, (err, updatedBlog) => {
		if (err) {
			res.redirect("/blogs");
		} else {
			res.redirect("/blogs/" + req.params.id);
		}
	});
});

// DELETE ROUTE
app.delete("/blogs/:id", (req, res) => {
	// destory blog
	Blog.findByIdAndRemove(req.params.id, (err) => {
		if (err) {
			res.redirect("/blogs");
		} else {
			res.redirect("/blogs");
		}
	});
});

app.listen(3000, function(){
	console.log("SERVER IS RUNNING!");
});