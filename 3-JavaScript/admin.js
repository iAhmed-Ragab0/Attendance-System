let menu_btn = document.querySelector("#menu-btn");
let sidebar = document.querySelector("#sidebar");
let container = document.querySelector(".my-container");
let logOut = document.querySelector(".btn-Out");


var pendingData = [];
var employeeData = [];
var dailyReportArr = [];
var rangeReportMap = new Map();


menu_btn.addEventListener("click", () => {
  sidebar.classList.toggle("active-nav");
  container.classList.toggle("active-cont");
});

window.onload = async function () {

  $("#EmployeeContainer").hide();
  $("#dailyReportContainer").hide();
  $("#rangeReportContainer").hide();

  $("#pendingLi").click(function (e) {
    $("#pendingEmpCont").show();
    $("#EmployeeContainer").hide();
    $("#dailyReportContainer").hide();
    $("#rangeReportContainer").hide();

  });

  $("#empLi").click(function (e) {
    $("#pendingEmpCont").hide();
    $("#EmployeeContainer").show();
    $("#dailyReportContainer").hide();
    $("#rangeReportContainer").hide();

  });

  $("#dailyLi").click(function (e) {
    $("#pendingEmpCont").hide();
    $("#EmployeeContainer").hide();
    $("#dailyReportContainer").show();
    $("#rangeReportContainer").hide();

  });

  $("#rangLi").click(function (e) {
    $("#pendingEmpCont").hide();
    $("#EmployeeContainer").hide();
    $("#dailyReportContainer").hide();
    $("#rangeReportContainer").show();

  });

  // $("#btn-Out").click(function (e) {
  //   localStorage.clear();
  //   location.replace("../1-HTML/login.html");
  // });
  
// logout
logOut.addEventListener("click", (e) => {
  localStorage.clear();
  location.replace("../1-HTML/login.html");
});

  pendingData = await loadNamesPending();
  employeeData = await loadNamesEmployee();
  dailyReportArr= await  dailyReport();
  rangeReportMap= await  getRangeAdminReport();

  
  await bindDataPending();
  await bindDataEmployee();
  await bindDailyReport();
  await bindDataRangeReport();


  let dateFrom = document.getElementById("dateFrom")
  let dateTo = document.getElementById("dateTo")
  let SearchBtn = document.getElementById("searchBtn")

  SearchBtn.addEventListener("click",async()=>{

    let data = await getAdminRangeReportData(dateFrom.value, dateTo.value);
    rangeReportMap = data;
    
    $("#table-monthly").DataTable().destroy();

    await bindDataRangeReport();

  });

};


/*************************************** pending table *********************************************** */

//table for pending employee
 async function loadNamesPending() {
  const response = await fetch("http://localhost:3000/usersData?Authenticated=false");
  const names = await response.json();
  return names;
} 

// showing pending employees
function bindDataPending() {
  var table = $("#pending-table").DataTable({
    data: pendingData,
    columns: [
      { data: "fName" },
      { data: "lName" },
      { data: "Age" },
      { data: "Email" },
      { data: "Address" },
      {
        data: "Approve",
        defaultContent: `<button class='btn-approve'>Approve</button>`,
      },
      {
        data: "Disapprove",
        defaultContent: "<button class='btn-disapprove'>Disapprove</button>",
      },
    ],
  });



// approve employee in employee table
  $("#pending-table tbody").on("click", ".btn-approve", async function () {
    rowData = table.row($(this).parents("tr")).data();
    let RemoveId = rowData.id;
    await postEmp(rowData.id);
  });

// post approved employee in database
async function postEmp(id) {

  fetch(`http://localhost:3000/usersData/${id}`)
  .then((response) => response.json())
  .then((userDataObject) => {
    emailjs.send("default_service", "template_uyf499f", {
      to_name: `${userDataObject.fName}`,
      message: `Username: ${userDataObject.userName}`,
      massage2: `Password: ${userDataObject.password}`,
      email_id: userDataObject.Email,
      subject: "ITI Login Information",
      }).then((e)=>{

    fetch(`http://localhost:3000/usersData/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({Authenticated: true}),

  });
  });


  


    
  });





}


// disapprove employee
  $("#pending-table tbody").on("click", ".btn-disapprove", async function () {
    rowDataLeave = table.row($(this).parents("tr")).data();
    console.log(rowDataLeave);
    let RemoveId = rowDataLeave.id;
    rowDataLeave.id = "";
    await RemoveFromPending(RemoveId);
  });
}

//send email 
function sendEmail(userDataObject) {

     emailjs.send("default_service", "template_uyf499f", {
        to_name: `${userDataObject.fName}`,
        message: `Username: ${userDataObject.userName}`,
        massage2: `Password: ${userDataObject.password}`,
        email_id: userDataObject.Email,
        subject: "ITI Login Information",
        })
}


 /********************************************** Current Employees ***************************************** */

 

// load current employees data
async function loadNamesEmployee() {
  response = await fetch("http://localhost:3000/usersData?Authenticated=true");
  names = await response.json();
  return names;
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


/*********************************************** daily report ************************************************/

// get Daily report from database
async function dailyReport() {
  let date= new Date();
  const response = await fetch(`http://localhost:3000/attendances?date=${formatDate(date)}`);
  const dailyReport = await response.json();
  console.log(dailyReport)
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



/********************************************** Range Report ********************************************** */

// get range report from database
async function getRangeAttendancesForAllUsers(fromDate, toDate) {
  let usersAttendances = await fetch(`http://localhost:3000/attendances?_expand=user&date_lte=${toDate}&date_gte=${fromDate}`);
  return await usersAttendances.json();
} 


//bind range report into table 
function bindDataRangeReport() {
  let rangeReportArr = [];
  rangeReportMap.forEach((val)=> {
      rangeReportArr.push(val)
  });
  console.log(rangeReportArr)
  $("#table-monthly").DataTable({
    data: rangeReportArr,
    columns: [
      {data: "name"},
      { data: "late" },
      { data: "absence" },
      { data: "attend" },
      { data: "excuse" },
  
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


// admin range report
function isLate(time) {
  let lateTime = calculateDiffTime("8:30:00", msToTime(time));
  let latTimeArr = lateTime.split(":");

  return Number(latTimeArr[1]) > 0 ? true : Number(latTimeArr[0]) > 0;
}

function isExcuse(time) {
  let excuseTime = calculateDiffTime(msToTime(time), "15:30:00");
  let excuseTimeArr = excuseTime.split(":");

  return Number(excuseTimeArr[1]) > 0 ? true : Number(excuseTimeArr[0]) > 0;
}

function msToTime(milli) {
  let time = new Date(milli);
  let hours = time.getHours();
  let minutes = time.getMinutes();
  let seconds = time.getSeconds();
  return hours + ":" + minutes + ":" + seconds;
}

function isAbsence(time) {

  if (time === 0)
      return true;

  let lateTime = calculateDiffTime("8:30:00", msToTime(time));
  let latTimeArr = lateTime.split(":");

  return Number(latTimeArr[1]) > 30 ? true : Number(latTimeArr[0]) > 0;
}

function calculateDiffTime(start, end) {

  start = start.split(":");
  end = end.split(":");

  if (+start[0] > +end[0])
      return "00:00";
  else if (+start[1] > +end[1])
      return "00:00";

  let startDate = new Date(0, 0, 0, start[0], start[1], 0);
  let endDate = new Date(0, 0, 0, end[0], end[1], 0);
  let diff = endDate.getTime() - startDate.getTime();
  let hours = Math.floor(diff / 1000 / 60 / 60);
  diff -= hours * 1000 * 60 * 60;
  let minutes = Math.floor(diff / 1000 / 60);

  // If using time pickers with 24 hours format, add the below line get exact hours
  if (hours < 0)
      hours = hours + 24;

  return (hours <= 9 ? "0" : "") + hours + ":" + (minutes <= 9 ? "0" : "") + minutes;
}


// groupping attendance array into each employee attendance
async function getAdminRangeReportData(fromDate, toDate) {
  let usersAttendances = await getRangeAttendancesForAllUsers(fromDate, toDate);

  const usersMap = new Map();

  usersAttendances.forEach((item) => {
      if (usersMap.has(item.userId)) {
          let userAttend = usersMap.get(item.userId);

          if (isAbsence(item.in))
              userAttend.absence++
          else {
              userAttend.attend++;
              if (isLate(item.in))
                  userAttend.late++;
              if (isExcuse(item.out))
                  userAttend.excuse++;
          }
      } else {
          let newRow = {
              late: 0,
              absence: 0,
              attend: 0,
              excuse: 0,
              name: `${item.employeeName}`
          };


          if (isAbsence(item.in))
              newRow.absence++
          else {
              newRow.attend++;
              if (isLate(item.in))
                  newRow.late++;
              if (isExcuse(item.out))
                  newRow.excuse++;
          }
          usersMap.set(item.userId, newRow);
      }
  });
  return usersMap;
}

// get deafult range as from 1 to 30 from current month
async function getRangeAdminReport() {

  let month = new Date().getMonth()+1;
  month = month <= 9? `0${month}` : `${month}`;
  let data = await getAdminRangeReportData(`2023-${month}-01`, `2023-${month}-30`);
  console.log(data)
  return data;
}





 
