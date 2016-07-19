var $ = require('jquery');

function loading() {
    if(localStorage.getItem("EditUser")) {
        alert("This is working");
        var title = document.getElementById('addTitle');
        var button = document.getElementById('AddBtn');
        var form = document.getElementById('addForm');
        title.innerHTML = "Update Reward : ";
        button.innerHTML = "Update";
        window.localStorage.clear();
    }
}

function fill() {
    var id = document.getElementById('empid').value;

    var obj = {'id': id } ;
    $.ajax({
        type: 'POST',
        data: JSON.stringify(obj),
        contentType: 'application/json',
        url: 'http://localhost:3000/fill',
        error: function () {
            console.log("Not working");
        }
    }).done(function (result) {
        console.log(result);
        var fn = document.getElementById('fname');
        var ln = document.getElementById('lname');
        fn.value = result.fname;
        ln.value = result.lname;
    });
}