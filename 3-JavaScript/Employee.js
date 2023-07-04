let menu_btn = document.querySelector("#menu-btn");
let sidebar = document.querySelector("#sidebar");
let container = document.querySelector(".my-container");

menu_btn.addEventListener("click", () => {
    sidebar.classList.toggle("active-nav");
    container.classList.toggle("active-cont");
});
    

var employeeData = [];
var dailyReportArr = [];

window.onload = async function () {

    $("#EmployeeContainer").hide();
    $("#dailyReportContainer").hide();

    $("#empLi").click(function (e) {
        $("#pendingEmpCont").hide();
        $("#EmployeeContainer").show();
        $("#dailyReportContainer").hide();
    
      });

    $("#dailyLi").click(function (e) {
    $("#pendingEmpCont").hide();
    $("#EmployeeContainer").hide();
    $("#dailyReportContainer").show();
 

    });

    $("#logout").click(function (e) {
        localStorage.clear();
        location.replace("../1-HTML/login.html");
      });

    empLocalData = JSON.parse(localStorage.getItem("EmployeeData"))
    // console.log(empLocalData)

    
      employeeData = await loadNamesEmployee();
      dailyReportArr= await  dailyReport();

      await bindDataEmployee();
      await bindDailyReport();






}

/******************************************** Employee Data***************************************************** */


// load current employees data
async function loadNamesEmployee() {
    userData = JSON.parse(localStorage.getItem("EmployeeData"))
    // console.log(userData)
    employeeData.push(userData)
    return userData;
  }
  
  //bind current employees to table 
  function bindDataEmployee() {
    $("#table-employee").DataTable({
      data: employeeData,
      columns: [
        { data: "fName" },
        { data: "lName" },
        { data: "Email" },
        { data: "Address" },
      ],
    });
  }
  
  /************************************** daily report *********************************************** */
// get Daily report from database
async function dailyReport() {
    let date= new Date();
    const response = await fetch(`http://localhost:3000/attendances?date=${formatDate(date)}&userName=${userData[0].userName}`);
    const dailyReport = await response.json();
    // console.log(userData[0].userName)
    return dailyReport;
  }
  
  //bind daily report into table 
  function bindDailyReport() {
  
    let table = $("#dailyReport-table").DataTable({

     data: dailyReportArr,  
     columns: [
       { data: "employeeName" },
       { data: "userId" },
       { data: "date" },
       { data: "in" },
       { data: "out" },
    
     ],
   });
  }
  
  //get date fun 
function formatDate(date) {
    let d = null;
  
    if (arguments.length)
        d = new Date(date);
    else
        d = new Date();
    let month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();
  
    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;
  
    return [year, month, day].join('-');
  }