
window.addEventListener("load" , function(){
   
    let userNameElement = document.getElementById('userName');
    let passwordElement = document.getElementById('password');
    // let invalidLoginSpan = document.getElementById('spanID')

    let loginForm = document.getElementById("FormID")

    



    loginForm.addEventListener("submit", event => {
        

        event.preventDefault();
       
        // submit fields and check authentication
        fetch('http://localhost:3000/usersData', {
          method: 'GET',
          headers: { 'Content-type': 'application/JSON;charset=UTF-8' }})
          .then((response) => response.json())
          .then((data) => {
            {

              for (let i = 0; i < data.length; i++) {
                
                if (userNameElement.value == "admin" && passwordElement.value == "admin" && data[i].position == "Admin") 
                {
                  // invalidLoginSpan.style.display="none"                  
                  location.href = "../1-HTML/Admin.html"
                }
                else if (userNameElement.value == data[i].userName && passwordElement.value == data[i].password 
                      && data[i].Authenticated == true ) {

                          // invalidLoginSpan.style.display="none"  

                          if (data[i].position == "Security") {

                            // invalidLoginSpan.style.display="none"                  
                            location.href = './attendance.html'
                            
                          } 
                          else  if (data[i].position == "Employee") {
                            // invalidLoginSpan.style.display="none"                  
                            location.href = './Employee.html'
                  
                            localStorage.setItem("EmployeeData",JSON.stringify([data[i]]))



                          }

                }
                else {

                  userNameElement.style.border = '3px solid red';
                  passwordElement.style.border = '3px solid red'
                  // invalidLoginSpan.style.display="block"      
                  // preventDefault();            

                }
              }
            }
      })
    })



})

