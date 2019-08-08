var express = require("express");
var app = express();

// "/" => "Hi There!"
app.get("/", function(req, res){
	res.send("Hi There!");
});
// "/bye" => "Goodbye"
app.get("/bye", function(req,res){
	res.send("Goodbye");
});
// "/dog" => "MEOW!"
app.get("/dog", function(req, res){
	res.send("MEOW!");
});

app.get("/r/:subredditName", function(req, res){
	var subreddit = req.params.subredditName;
	res.send("WELCOME TO THE "+ subreddit.toUpperCase() + " SUBREDDIT");
});

app.get("/r/:subredditName/comments/:id/:title/", function(req, res){
	res.send("WELCOME TO THE COMMENT PAGE");
});

app.get("*", function(req, res){
	res.send("YOU ARE A STAR!!");
});





// Tell Express to listen for requests (start server)
app.listen(process.env.PORT, process.env.IP, function(){
	console.log("started");
});