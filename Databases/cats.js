var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/cats", { useNewUrlParser: true });

// 	useNewUrlParser: true,
// 	useCreateIndex: true
// }).then(() => {
// 	console.log("Connected to DB!");
// }).catch( err => {
// 	console.log('ERROR', err.message);
// });

var catSchema = new mongoose.Schema({
	name: String,
	age: Number,
	temperament: String
});

var Cat = mongoose.model("Cat", catSchema);

//adding a new cat to the DB
// var george = new Cat({
// 	name: "Mrs. Norris",
// 	age: 7,
// 	temperament: "Evil"
// });

// george.save(function(err, cat){
// 	if(err){
// 		console.log("SOMETHING WENT WRONG!");
// 	} else {
// 		console.log("WE JSUT SAVED A CAT TO THE DB:");
// 		console.log(cat);
// 	}
// });

Cat.create({
	name: "Snow White",
	age: 15,
	temperament: "Bland",
}, function(err, cat){
	if(err){
		console.log(err);
	} else {
		console.log(cat);
	}
});

// retrieve all cats from the DB and console.log each one
Cat.find({}, (err, cats) => {
	if(err){
		console.log("OH NO, ERROR!");
		console.log(err);
	} else {
		console.log("ALL THE CATS......");
		console.log(cats);
	}
});