var formUsernameElm = document.querySelector("#empName");
let table = document.querySelector("table");
let btn = document.querySelector(".btn-1");
let btn2 = document.querySelector(".btn-Out");

let empId = 0;
let arrData;

let menu_btn = document.querySelector("#menu-btn");
let sidebar = document.querySelector("#sidebar");
let container = document.querySelector(".my-container");

menu_btn.addEventListener("click", () => {
  sidebar.classList.toggle("active-nav");
  container.classList.toggle("active-cont");
});

//

// logout
btn2.addEventListener("click", (e) => {
  localStorage.clear();
  location.replace("../1-HTML/login.html");
});

//attend
btn.addEventListener("click", (e) => {
  e.preventDefault();

  if (empName.value.trim().length == "") {
    alert("please Enter employee user name ");
    return;
  }

  // const formUsernameElm = document.getElementById('Username');

  fetch(
    `http://localhost:3000/usersData?userName=${formUsernameElm.value}&Authenticated=true`
  )
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      if (data.length === 1 && data[0].userName === formUsernameElm.value) {
        let date = new Date();
        let today = formatDate();
        let userId = data[0].id;
        let userName = data[0].userName;
        let employeeName1 = data[0].fName + " " + data[0].lName;

        fetch(
          `http://localhost:3000/attendances?date=${today}&userId=${userId}`
        )
          .then((res) => res.json())
          .then((data) => {
            if (data.length == 0) {
              //post attend time
              let postBody = {
                in: formatTime(new Date()),
                userId: userId,
                out: 0,
                date: today,
                userName: userName,
                employeeName: employeeName1,
              };
              fetch(`http://localhost:3000/attendances`, {
                headers: {
                  "Content-Type": "application/json",
                },
                method: "POST",
                body: JSON.stringify(postBody),
              })
                .then((res) => {
                  return res.json();
                })
                .then((data) => {
                  alert(`Attend time confirmed for Employee ${employeeName1}`);
                });
            } else {
              if (data[0].out === 0) {
                let patchBody = { out: formatTime(new Date()) };
                fetch(`http://localhost:3000/attendances/${data[0].id}`, {
                  headers: {
                    "Content-Type": "application/json",
                  },
                  method: "PATCH",
                  body: JSON.stringify(patchBody),
                })
                  .then((res) => {
                    return res.json();
                  })
                  .then((data) => {
                    alert(`Leave time confirmed for Employee ${employeeName1}`);
                  });
              } else {
                alert(`Employee ${employeeName1} is already left`);
              }
            }

            //     if (data.length && data[0].out == 0 ) {
            //         let patchBody = {out: formatTime(new Date())}
            //         fetch(`http://localhost:3000/attendances/${data[0].id}`, {
            //             headers: {
            //                 'Content-Type': 'application/json'
            //             },
            //             method: "PATCH",
            //             body: JSON.stringify(patchBody)
            //         }).then((res) => {
            //             return res.json();
            //         })
            //         .then((data) => {
            //             alert(`Leave time confirmed for Employee ${employeeName1}`);
            //         })
            //     }
            //     else if (data[0].out !== 0){
            //       alert(`Employee ${employeeName1} is already left`);

            //     }
            //     else {
            //         let postBody = {in: formatTime(new Date()),userId: userId, out: 0, date: today ,userName: userName , employeeName:employeeName1 }
            //         fetch(`http://localhost:3000/attendances`, {
            //             headers: {
            //                 'Content-Type': 'application/json'
            //             },
            //             method: "POST",
            //             body: JSON.stringify(postBody)
            //         }).then((res) => {
            //             return res.json();
            //         })
            //             .then((data) => {
            //               alert(`Attend time confirmed for Employee ${employeeName1}`);
            //         })
            //     }
            // }) }

            // else {
            //   alert(` you are not  an Authintecated Employee`);

            // }
          });
      }
    });
});

window.addEventListener("onload", function () {
  $("#confirm-attend").hide();

  empName = document.getElementById("empName").value;
});

// helper function
function formatTime(date) {
  let hours = date.getHours();
  let minutes = date.getMinutes();
  let ampm = hours >= 12 ? "pm" : "am";
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? "0" + minutes : minutes;
  let strTime = hours + ":" + minutes + " " + ampm;
  return strTime;
}

function getCurrentTime() {
  let date = new Date();
  let hrs = date.getHours();
  let mins = date.getMinutes();
  if (hrs <= 9) hrs = "0" + hrs;
  if (mins < 10) mins = "0" + mins;
  return hrs + ":" + mins;
}

function formatDate(date) {
  let d = null;

  if (arguments.length) d = new Date(date);
  else d = new Date();
  let month = "" + (d.getMonth() + 1),
    day = "" + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return [year, month, day].join("-");
}
