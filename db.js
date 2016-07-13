var mongoose = require('mongoose');

var employee = mongoose.Schema({
    id : Number,
    firstName: String,
    lastName: String,
    password : {type : String, default : "Zydesoft" },
    emailId: String,
    Points : {type : Number , min : 0 , max : 100 }
});

var rewards = mongoose.Schema({
    EmployeeId : Number,
    Date: { type: Date, default: Date.now },
    Reason: String,
    showToUser : Boolean,
    emailId: String,
    Points : Number
});

var employee = mongoose.model('employee', employee, "test");
var reward = mongoose.model('reward',rewards,"test");

var dbHost = 'mongodb://arvind:arvind@ds021034.mlab.com:21034/user-details';
mongoose.connect(dbHost);

/*
var db = mongoose.connection;

 db.on('error', console.error.bind(console, 'connection error:'));
 db.once('open', function() {
 console.log("Connected to DB");
 //findValue();
 });
 var findValue = function(){
 //Now querying those books which have less than 100 pages
 //Find API takes in a query condition, attributes in the document to be projected,
 //callback to be executed when the data is available.
 employee.find({pages : {$lt:100}}, "name isbn author pages", function(err, result){
 if ( err ) throw err;
 console.log("Find Operations: " + result);
 });
 };

 var update = function(){

 Find the book to be updated using the condition and then execute the update
 passed to the API as the second argument

employee.update({isbn : {$eq: 'MNG125'}}, {$set: {name: "Mongoose Demo 3.1"}}, function(err, result){
    console.log("Updated successfully");
    console.log(result);
});
};

var Delete= function(){

     When callback is not passed, the action is not invoked on the collection
     until the exec() method is called.
     In this case I am not passing the callback and instead executing the action
     by invoking the exec() method.

    employee.remove({isbn:{$eq: 'MNG124'}}).exec();
};
*/