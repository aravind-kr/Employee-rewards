var $ = require('jquery');

function result () {
    var id = document.getElementById('empid').value;
    var obj = {'id': id } ;

    $.ajax({
        type: 'POST',
        data: JSON.stringify(obj),
        contentType: 'application/json',
        url: 'http://localhost:3000/result',
        error: function () {
            console.log("Not working");
        }
    }).done(function (result) {
        var chartData = [];

        for (var i = 0, l = result.length; i < l; i++) {
            var value = parseFloat(result[i].y);
            chartData.push({ label: result[i].label , y: value  });
        }
        alert(chartData);
        console.log(chartData);
        var chart = new CanvasJS.Chart("chartContainer", {
            theme: "theme1",//theme1
            title: {
                text: "Employee Results"
            },
            animationEnabled: false,   // change to true
            data: [
                {
                    // Change type to "bar", "area", "spline", "pie",etc.
                    type: "bar",
                    dataPoints: chartData
                }
            ]
        });
        chart.render();
    });
    
}