var $ = require('jquery');

function del(id) {
    //alert(id);
    var decision = confirm("Are you sure to delete the reward ?");
    if(decision) {
        var obj = {'id': id};
        $.ajax({
            type: 'POST',
            data: JSON.stringify(obj),
            contentType: 'application/json',
            url: 'http://localhost:3000/delReward',
            error: function () {
                console.log("Not working");
            }
        }).done(function () {
            window.location.reload();
        });
    }
}

function editRewards(id){
    var obj = {'id': id};
    $.ajax({
        type: 'POST',
        data: JSON.stringify(obj),
        contentType: 'application/json',
        url: 'http://localhost:3000/delReward',
        error: function () {
            console.log("Not working");
        }
    });
    
    var state = true ;
    localStorage.setItem("EditUser",state);
    window.location = "http://localhost:3000/reward";
}