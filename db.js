var mongoose = require('mongoose');
mongoose.Promise = global.Promise;

var employee = mongoose.Schema({
    id : Number,
    firstName: String,
    lastName: String,
    password : {type : String, default : "Zydesoft" },
    emailId: String,
    Points : {type : Number , min : 0 , max : 100 }
});

var rewards = mongoose.Schema({
    No : Number,
    Name : String,
    EmployeeId : Number,
    Date: { type: Date, default: Date.now },
    Reason: String,
    showToUser : Boolean,
    Points : Number
});

var employee = mongoose.model('employee', employee, "test");
var reward = mongoose.model('reward',rewards,"rewards");

var dbHost = 'mongodb://<dbuser>:<dbpassword>@ds021034.mlab.com:21034/user-details';
mongoose.connect(dbHost);
