//document.getElementById("thing").innerHTML = "Hello Dolly.";
function CreateAccountPage(){
  document.getElementById('CreateButton');
    // Use the Fetch API to load the other HTML file
    fetch("createAccount.html")
      .then(response => response.text())
      .then(data => {
        // Replace the content of the 'box' element with the loaded HTML
        document.getElementById('website').innerHTML = data;
      })
      .catch(error => {
        console.error('Error loading other.html:', error);
      });
  };

function confirmationPage(username, password){
      const formData = new FormData();
      formData.append("Username", username.value);
      formData.append("Password", password.value);
      console.log(formData.get("Username"));
      
      fetch("/login", {
          method: "POST",
          body: formData,
      })
      .then(response => response.text())
      .then(data => {
          // Handle the response data (if needed)
          
          if (data === '{"error":"Username Does Not Exist"}') {
              alert("No Account Found with that Username");
          } else if (data === '{"error":"Incorrect password"}') {
          alert("Incorrect Password");
        } else{
              // Registration successful
              // Use the Fetch API to load the confirmation HTML file
              fetch("confirmation.html")
                  .then(response => response.text())
                  .then(data => {
                      // Replace the content of the 'website' element with the loaded HTML
                      document.getElementById('website').innerHTML = data;
                  })
                  .catch(error => {
                      console.error('Error loading confirmation.html:', error);
                  });
          }
      })
      .catch(error => {
          console.error("Error during login:", error);
      });
  };

  function CreateAccount(username, email, password, passwordConfirm) {
    console.log("Email:" + email.value);
    if (!validateEmail(email.value)) {
        alert("Invalid Email Format");
    } else if (!validatePassword(password.value)) {
        console.log("Password:" + password.value);
        alert("Incorrect Password Format");
    } else if (password.value != passwordConfirm.value) {
        alert("Passwords are not the same");
    } else {
        const formData = new FormData();
        formData.append("Username", username.value);
        formData.append("email", email.value);
        formData.append("Password", password.value);
        console.log(formData.get("Username"));
        
        fetch("/register", {
            method: "POST",
            body: formData,
        })
        .then(response => response.text())
        .then(data => {
            // Handle the response data (if needed)
          
            if (data === "Error creating user account") {
                alert("Username Already Exist");
            } else {
                // Registration successful
                // Use the Fetch API to load the confirmation HTML file
                fetch("confirmation.html")
                    .then(response => response.text())
                    .then(data => {
                        // Replace the content of the 'website' element with the loaded HTML
                        document.getElementById('website').innerHTML = data;
                    })
                    .catch(error => {
                        console.error('Error loading confirmation.html:', error);
                    });
            }
        })
        .catch(error => {
            console.error("Error during registration:", error);
        });
    }
}

  
    function validatePassword(input) {
      // Check if the string has at least 12 characters
      if (input.length < 12) {
        return false;
      }
    
      // Check if the string contains at least one uppercase letter
      if (!/[A-Z]/.test(input)) {
        return false;
      }
    
      // Check if the string contains at least one special character
      if (!/[!@#$%^&*()_+{}\[\]:;<>,.?~\-]/.test(input)) {
        return false;
      }
    
      // All criteria are met
      return true;
    }

    function validateEmail(email) {
      // Regular expression pattern to match an email address format
      const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    
      // Test the email against the pattern
      return emailPattern.test(email);
    }

    