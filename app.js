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

var routes = require('./routes/index');
var admin = require('./routes/admin');

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

    employee.find({ __v : 0}).exec(function (err , result ){
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
    });
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
        result[0].password = "Zydesoft";
        result[0].Points = 0;

        result[0].save( function ( err, result, count ){
            if( err ) return next( err );
        });
    });
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
    res.redirect( '/admin' );
});

app.post('/delete', function (req, res) {
    console.log(req.body.id);
    var db = new json("user-list",true,false);
    //console.log(index);
    
    employee.find({ id : req.body.id}).exec(function (err,result) {
        console.log(result);
        result[0].remove( function ( error, todo ){
            if( error ) return next( error );
            res.redirect( '/admin' );
        });

        console.log(db.getData('/user/'+(req.body.id-100)));
    });

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