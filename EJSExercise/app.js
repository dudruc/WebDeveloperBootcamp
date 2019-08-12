const express = require("express");
const app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");

app.get("/", function(req, res){
	res.render("home");
});

app.get("/fallinlovewith/:thing", (req, res) => {
	var thing = req.params.thing;
	//res.send("You fell in love with " + thing);
	res.render("love", {thingVar: thing});
});

app.get("/posts", (req, res) => {
		var posts = [
			{title: "Post 1", author: "Susy"},
			{title: "My adorable pet bunny", author: "Charlie"},
			{title: "Can you believe this pomsky?", author: "Colt"}
		];
	
	res.render("posts", {posts: posts});
});

app.listen(3000, () => {
	console.log("Server is listening!!!");
});