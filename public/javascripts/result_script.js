var $ = require('jquery');

function result () {
    var view = document.getElementById('view').value;
    var date = document.getElementById('date').value;
    var start = document.getElementById('startdate').value;
    var end = document.getElementById('enddate').value;
        //document.getElementById('empid').value;
    var obj = {
        'view': view ,
        'date': date,
        'start': start,
        'end': end
    } ;
    
    $.ajax({
        type: 'POST',
        data: JSON.stringify(obj),
        contentType: 'application/json',
        url: 'http://localhost:3000/result',
        error: function () {
            console.log("Not working");
        }
    }).done(function (result) {

        var dataPointsA = JSON.parse(result);

        //console.log(count);
        
        var chart = new CanvasJS.Chart("chartContainer", {
            theme: "theme2",//theme1
            title:{
                text: "Employee Rewards"
            },
            animationEnabled: false,   // change to true
            data: [{
                color: "#62C9C3",
                type: "bar",
                dataPoints: dataPointsA
            } ]
        });

        //chart.render();
        chart.render();
    });
    
}