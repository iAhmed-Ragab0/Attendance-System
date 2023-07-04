
window.addEventListener("load", function () {

    let emailArray =[];
    (async function verifyStorage(){
      let allEmpData = await fetch(`http://localhost:3000/usersData`);
      let allEmpDataobjects = await allEmpData.json();
     
      allEmpDataobjects.forEach(element => {
        emailArray.push(element.email);
      });
    })();

  let firstName = document.getElementById("firstName");
  let lastName = document.getElementById("lastName");
  let Age = document.getElementById("age");
  let address = document.getElementById("address");
  let email = document.getElementById("email");
  let radio ;
  // let radio2 = document.getElementById("radio2")
  let signUpForm = document.querySelector("form");

  //getting the position from user
  function getPosition() {
    if(document.getElementById('radio1').checked) {
      return  radio = "Employee"
       
    }
    else if(document.getElementById('radio2').checked) {
      return  radio = "Security"
       
    }
  }
  //posting datat into jsaon server
  signUpForm.addEventListener("submit", (event) => {
    event.preventDefault();

    let formData = {
      fName: firstName.value.trim(),
      lName: lastName.value.trim(),
      Age: Age.value.trim(),
      Address: address.value.trim(),
      Email: email.value.trim(),
      userName: generateName(),
      password: generatePassword(),
      Authenticated: false,
      position: getPosition(),
      
      
    };

    //validation part before posting
    if (isEmailValide() && isAddressValide() && isFirstNameValide() && isLastNameValide() && isAgeValide() &&getPosition() ) {

      postData(formData);    
      this.alert("WAIT FOR ADMIN CONFIRMATION");
      window.open("../1-HTML/login.html","_blank");
      window.open("../1-HTML/Registration.html","_self").close();


                        
    }
     else {
      this.alert("make sure to check the role button and enter a valid data");
    }

  });

  
  //the display of the validation functions on the form:
  //frstname
  firstName.addEventListener("blur", function () {
    if (!isFirstNameValide()) {
      firstName.style.border = "3px solid red";
      this.nextElementSibling.style.display = "block";
    } else {
      firstName.style.border = "3px solid green";
      this.nextElementSibling.style.display = "none";
    }
  });
  //last name
  lastName.addEventListener("blur", function () {
    if (!isLastNameValide()) {
      lastName.style.border = "3px solid red";
      this.nextElementSibling.style.display = "block";
    } else {
      lastName.style.border = "3px solid green";
      this.nextElementSibling.style.display = "none";
    }
  });
  //age
  Age.addEventListener("blur", function () {
    if (!isAgeValide()) {
      Age.style.border = "3px solid red";
      this.nextElementSibling.style.display = "block";
    } else {
      Age.style.border = "3px solid green";
      this.nextElementSibling.style.display = "none";
    }
  });
  //address
  address.addEventListener("blur", function () {
    if (!isAddressValide()) {
      address.style.border = "3px solid red";
      this.nextElementSibling.style.display = "block";
    } else {
      address.style.border = "3px solid green";
      this.nextElementSibling.style.display = "none";
    }
  });
  //email
  email.addEventListener("blur", function () {
    if (!isEmailValide()) {
      email.style.border = "3px solid red";
      this.nextElementSibling.style.display = "block";
    } else {
      for (let i = 0; i < emailArray.length; i++) {
        if(email.value==emailArray[i]){
          email.style.border = "3px solid red";
          this.nextElementSibling.style.display = "block";
        }
      }
      email.style.border = "3px solid green";
      this.nextElementSibling.style.display = "none";
      
    }
  });


  function checkEmail(e){
    if (!IsEmailValid(email.value)) {

        email.classList.remove('is-valid');
        email.classList.add('is-invalid');
        email_validation.classList.add('d-none');
        email_validation2.classList.remove('d-none');
        return false;
      } else {
        for (let i = 0; i < emailArray.length; i++) {
          if(email.value==emailArray[i]){
            console.log(email_validation)
            email_validation.classList.remove('d-none');
            email_validation2.classList.add('d-none');
            email.classList.remove('is-valid');
            email.classList.add('is-invalid');
            return false;
          }
        }
        email_validation.classList.add('d-none');
        email.classList.remove('is-invalid');
        email.classList.add('is-valid');
        return true;
      }

}


  /* functions */
  function isFirstNameValide() {
    return firstName.value.match(/^[a-z ,.'-]+$/i);
  }

  function isLastNameValide() {
    return lastName.value.match(/^[a-z ,.'-]+$/i);
  }

  function isAgeValide() {
    return Age.value.match(/^(1[89]|[2-5][0-9]|6[0-5])$/);
  }

  function isAddressValide() {
    return address.value.match(/^[A-Z a-z]{3,30}/);
  }

  function isEmailValide() {
    return email.value.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{3}$/);
  }

  //email uniqueness check
  async function isEmailUniqe() {

    

    await fetch("http://localhost:3000/usersData", {
      method: "GET",
      headers: { "Content-type": "application/JSON;charset=UTF-8" },})
      .then((response) => response.json())
      .then((data) => {

        for (let i = 0; i < data.length; i++) {
          
          if (email.value !== data[i].Email) {
              return true;
          }
          else{
            return false;
          }

        }
    });
  }//end of is email unique

  //generating random User Name
  function generateName() {
    let length = 7, charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ", retVal = "";
   
    for (let i = 0, n = charset.length; i < length; ++i) {
      retVal += charset.charAt(Math.floor(Math.random() * n));
    }
    return retVal;
  }


  //generating random password
  function generatePassword() {
    let length = 8, charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789", retVal = "";

    for (let i = 0, n = charset.length; i < length; ++i) {
      retVal += charset.charAt(Math.floor(Math.random() * n));
    }
    return retVal;
  }

  
    //posting data to the json server function
    async function postData(arr) {
      const object = arr;
      await fetch("http://localhost:3000/usersData", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(object),
      });
    }
  








}); //end of load
