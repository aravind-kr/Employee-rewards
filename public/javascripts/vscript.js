var $ = require('jquery');

function del(id) {
    alert(id);
    var obj = {'id': id } ;
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