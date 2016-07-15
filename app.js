var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var clientSession = require('client-sessions');
var dialog = require('dialog');
var json = require('node-json-db');

var db = require('./db');
var mongoose = require('mongoose');
var employee = mongoose.model('employee');
var reward_model = mongoose.model('reward');

var routes = require('./routes/index');
var admin = require('./routes/admin');
var reward = require('./routes/reward');
var view = require('./routes/view');
var result = require('./routes/result');

var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/start', routes);
app.use('/admin', admin);
app.use('/reward',reward);
app.use('/view',view);
app.use('/result',result);

app.use(clientSession({
    cookieName: 'mySession',
    secret: 'blargadeeblargblarg',
    duration: 24 * 60 * 60 * 1000,
    activeDuration: 1000 * 60 * 5
}));

app.post('/login', function (req, res) {
  employee.find({id : req.body.id}).exec(function (err , result){
    if(err){
      console.log("Couldnt find");
      res.redirect('/start');
    }
    if(req.body.id == 10 && req.body.pass == "admin")
    {
        console.log("admin is working");
        req.mySession.user = 10 ;

        employee.find({ __v : 0}).exec(function (err , result ){
            //console.log(result[0]);
            var db = new json("user-list",true,false);
            var count =0;
            for(var item in result) {
                //console.log(result[item].firstName)
                db.push('/user/'+item+'/firstName',result[item].firstName);
                db.push('/user/'+item+'/lastName',result[item].lastName);
                db.push('/user/'+item+'/emailId',result[item].emailId);
                db.push('/user/'+item+'/id',result[item].id);
                count++;
            }
            db.push('/count',count);
            db.save();
            db.reload();
        });

        res.redirect('/admin');
    }
    else if(result.password == req.body.pass)
    {
        
        res.redirect('/start');
    }      
    else
      res.redirect('/start');
  });
});

app.post('/logout', function (req, res) {
    req.mySession.reset();
    res.redirect('/start');
});

app.post('/add', function (req, res) {

    console.log(req.body);
    new employee({
        id    : req.body.id,
        firstName : req.body.firstName,
        lastName : req.body.lastName,
        emailId    : req.body.emailId,
        password : "Zydesoft",
        Points : 0
    }).save( function ( err, employee, count ){
        if( err ) return next( err );
    });

        //console.log(result[0]);
        var db = new json("user-list",true,false);
        var count = db.getData('/count');
        //for(var item in result) {
            //console.log(result[item].firstName)
            db.push('/user/'+count+'/firstName',req.body.firstName);
            db.push('/user/'+count+'/lastName',req.body.lastName);
            db.push('/user/'+count+'/emailId',req.body.emailId);
            db.push('/user/'+count+'/id',req.body.id);
            //count++;
        //}
        db.push('/count',count+1);
        db.save();
        db.reload();
    res.redirect( '/admin' );
});

app.post('/update', function (req, res) {
    employee.find({id : req.body.id}).exec(function (err ,result) {
        if (err) return err;
        //console.log(result);
        result[0].id = req.body.id;
        result[0].firstName = req.body.firstName;
        result[0].lastName = req.body.lastName;
        result[0].emailId = req.body.emailId;
        result[0].save( function ( err, result, count ){
            if( err ) return next( err );
        });
    });

        var db = new json("user-list",true,false);
        var count = db.getData('/count');
    var user = db.getData('/user');
    for(var item in user) {
        //console.log(item);
        if(db.getData('/user/'+item+'/id') == req.body.id) {
            db.push('/user/' + item + '/firstName', req.body.firstName);
            db.push('/user/' + item + '/lastName', req.body.lastName);
            db.push('/user/' + item + '/emailId', req.body.emailId);
            db.push('/user/' + item + '/id', req.body.id);
            db.push('/count', count + 1);
        }
    }
        db.save();
        db.reload();

    res.redirect( '/admin' );
});

app.post('/delete', function (req, res) {
    //console.log(index);
    console.log(req.body.id);
    employee.find({ id : req.body.id}).exec(function (err,result) {
        console.log(result);
        
        result[0].remove(function (error, todo) {
            if (error) return next(error);
        });

        var id = req.body.id - 100;
        console.log(id);
        var db = new json("user-list",true,false);
        var count = db.getData('/count');
        db.delete('/user/'+id);
        db.push('/count',count-1);
    });
    res.redirect('/admin');
});

app.post('/fill', function (req, res) {
    console.log(req.body.id);
    var result = {};
    var db = new json("user-list",true,false);
    var user = db.getData('/user');
    for(var item in user) {
        //console.log(item);
        if (db.getData('/user/' + item + '/id') == req.body.id) {
            result.fname = db.getData('/user/' + item + '/firstName');
            result.lname = db.getData('/user/' + item + '/lastName');
        }
    }
    db.save();
    db.reload();
    res.send(result);
});

app.post('/addr', function (req, res) {
   console.log(req.body);
    if (req.body.id == 0)
        res.redirect('/reward');

    var db = new json("rewards",true,false);
    var count = db.getData('/count');
    new reward_model({
        No : count,
        EmployeeId    : req.body.id,
        showToUser : req.body.Show,
        Date : req.body.date,
        Points : req.body.points,
        Reason : req.body.reason
    }).save( function ( err, reward, count ){
        if( err ) return next( err );
    });


    db.push('/rewards/'+count+'/No',count);
    db.push('/rewards/'+count+'/id',req.body.id);
    db.push('/rewards/'+count+'/show',req.body.Show);
    db.push('/rewards/'+count+'/date',req.body.date);
    db.push('/rewards/'+count+'/Points',req.body.points);
    db.push('/rewards/'+count+'/Reason',req.body.reason);
    db.push('/count',count+1);
    res.redirect('/reward');
});

app.post('/delReward', function (req, res) {
    //console.log(req.body);
    reward_model.find({ No : req.body.id}).exec(function (err,result) {
        console.log(result);
        
        result[0].remove(function (error, todo) {
            if (error) return next(error);
        });
        
        var id = req.body.id ;
        //console.log(id);
        var db = new json("rewards",true,false);
        var count = db.getData('/count');
        db.delete('/rewards/'+id);
        db.push('/count',count-1);
    });

    res.redirect('/view');
});

app.post('/result', function (req, res) {
    console.log(req.body);
    var obj = [];
    var obj2 = [];
    var db = new json("rewards",true,false);
    var rewards = db.getData('/rewards');
    
    for(var item in rewards){
        if (rewards[item].id == req.body.id){
            obj.push({label : req.body.id , y : rewards[item].Points });
        }
    }
    console.log(obj);
    
    res.send(obj);
});


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
/*app.set('port', process.env.PORT || 3000);

var server = app.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + server.address().port);
});*/