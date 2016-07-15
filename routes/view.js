var express = require('express');
var router = express.Router();
var fs = require('fs');

router.get('/', function(req, res, next) {
    var users = JSON.parse(fs.readFileSync('/run/media/arvindkr/Entertainment/arvind/documents/Employee Rewards/rewards.json', 'utf8'));
    res.render('view', {
        title: 'Express' ,
        reward : users
    });
});

module.exports = router;
