var express = require('express');
var router = express.Router();

/* GET login page. */
router.get('/', function(req, res, next) {
    var users = require('../user-list.json');
    res.render('admin', {
        title: 'Express' ,
        user : users.user,
        editUser : false
    });
});

module.exports = router;
