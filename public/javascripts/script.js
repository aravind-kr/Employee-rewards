function editUser() {
    var state = true ;
    localStorage.setItem("EditUser",state);
    window.location.reload();
}

function Loading() {
    if(localStorage.getItem("EditUser")) {
        var addbtn = document.getElementById("AddBtn");
        var title = document.getElementById("addUser");
        var addheading = document.getElementById("addTitle");
        var form = document.getElementById("addForm");
        form.setAttribute("action","/update");
        addbtn.innerHTML = "Update";
        addheading.innerHTML = "Update User";
        title.innerHTML = "Update User";
        window.localStorage.clear();
    }
}

function deleteUser(id){
    //alert(id);
    var decision = confirm("Are you sure to delete the user ?");
    if(decision) {
        var obj = {'id': id};
        $.ajax({
            type: 'POST',
            data: JSON.stringify(obj),
            contentType: 'application/json',
            url: 'http://localhost:3000/delete',
            error: function () {
                console.log("Not working");
            }
        });
    }
}

$(document).ready(function(){
    $("#addForm").submit(function(){
        var bool = true, errorArr =[];
        $("#addForm input").each(function(){
            if($(this).val() == ""){
                errorArr.push($(this).attr("name"));
                bool = false;
            }
        });

        if(bool == false){
            var iconMsg = errorArr.join(", ") + " is required";
            $("#messages").empty().html(iconMsg);
            return false;
        }
    });
});