var express = require('express');
var router = express.Router();
var fs = require('fs');

router.get('/', function(req, res, next) {
    var users = JSON.parse(fs.readFileSync('/run/media/arvindkr/Entertainment/arvind/documents/Employee Rewards/user-list.json', 'utf8'));
    res.render('reward', {
        title: 'Express' ,
        user : users.user
    });
});

module.exports = router;
