document.addEventListener("DOMContentLoaded", () => {
    showScreen("screen1");
});

function showScreen(screenId) {
    document.querySelectorAll(".container").forEach(screen => {
        screen.classList.add("hidden");
    });
    document.getElementById(screenId).classList.remove("hidden");
}

function navigateTo(screenId) {
    showScreen(screenId);
}

// Form Validations
function validateLogin() {
    let email = document.getElementById("loginEmail").value;
    let password = document.getElementById("loginPassword").value;

    if (email && password) {
        navigateTo("screen4"); // Redirect to exam details
    } else {
        alert("Please fill in all fields.");
    }
}
function validateRegistration() {
    let fullName = document.getElementById("fullName").value;
    let email = document.getElementById("regEmail").value;
    let password = document.getElementById("regPassword").value;
    let photo = document.getElementById("photoUpload").files[0];
    let signature = document.getElementById("signatureUpload").files[0];

    if (!fullName || !email || !password || !photo || !signature) {
        alert("Please fill in all fields and upload required images.");
        return;
    }

    let photoSize = photo.size / 1024; // KB
    let signatureSize = signature.size / 1024;

    if (photoSize > 100 || signatureSize > 100) { 
        alert("Photo or Signature is too large. Please upload within the allowed size.");
        return;
    }

    // Store in local storage (or send to database)
    localStorage.setItem("fullName", fullName);
    localStorage.setItem("email", email);
    localStorage.setItem("password", password);
    localStorage.setItem("photo", URL.createObjectURL(photo));
    localStorage.setItem("signature", URL.createObjectURL(signature));

    // Move to next screen (Exam Details)
    document.getElementById("screen3").classList.add("hidden");
    document.getElementById("screen4").classList.remove("hidden");
}

// function validateExamDetails() {
//     let examDate = document.getElementById("examDate").value;
//     let examCenter = document.getElementById("examCenter").value;

//     if (examDate && examCenter) {
//         localStorage.setItem("examDate", examDate);
//         localStorage.setItem("examCenter", examCenter);
//         showScreen(5);  // Move to Payment Screen
//     } else {
//         alert("Please fill in all exam details before proceeding.");
//     }
// }
function validateExamDetails() {
    let examType = document.getElementById("examType").value;
    let branch = document.getElementById("branch").value;
    let examDate = document.getElementById("examDate").value;

    if (!examType || !branch || !examDate) {
        alert("Please fill in all fields.");
        return;
    }

    // Store exam details in localStorage
    localStorage.setItem("examType", examType);
    localStorage.setItem("branch", branch);
    localStorage.setItem("examDate", examDate);

    // Navigate to Payment Page
    navigateTo("screen5");
}


// function validateExamDetails() {
//     let examType = document.getElementById("examType").value;
//     let branch = document.getElementById("branch").value;
//     let date = document.getElementById("examDate").value;

//     if (examType && branch && date) {
//         document.getElementById("finalExam").innerText = examType;
//         document.getElementById("finalDate").innerText = date;
//         document.getElementById("hallTicketNumber").innerText = Math.floor(Math.random() * 100000);
//         navigateTo("screen5");
//     } else {
//         alert("Please fill in all fields.");
//     }
// }

function validateTransaction() {
    let transactionId = document.getElementById("transactionId").value;
    if (transactionId) {
        navigateTo("screen7");
    } else {
        alert("Please enter a transaction ID.");
    }
}

// Dynamic Branch Selection
function updateBranches() {
    let examType = document.getElementById("examType").value;
    let branchSelect = document.getElementById("branch");

    let branches = {
        engineering: ["CSE", "ECE", "Mechanical", "Civil"],
        medical: ["MBBS", "Dentistry", "Pharmacy", "Nursing"],
        arts: ["History", "Political Science", "Literature", "Sociology"]
    };
    branchSelect.innerHTML = `<option value="">-- Select Branch --</option>`;

    

    if (examType in branches) {
        branches[examType].forEach(branch => {
            let option = document.createElement("option");
            option.value = branch.toLowerCase();
            option.textContent = branch;
            branchSelect.appendChild(option);
        });
    }
}
function navigateTo(screenId) {
    console.log("Navigating to:", screenId); // Debugging output
    document.querySelectorAll('.container').forEach(screen => {
        screen.classList.add('hidden');
    });

    const nextScreen = document.getElementById(screenId);
    if (nextScreen) {
        nextScreen.classList.remove('hidden');
    } else {
        console.error("Screen not found:", screenId);
    }
}

function generateHallTicket() {
    document.getElementById("ticketName").textContent = localStorage.getItem("fullName");
    // document.getElementById("ticketDob").textContent = localStorage.getItem("dob");
    document.getElementById("ticketExamDate").textContent = localStorage.getItem("examDate");

    let photo = localStorage.getItem("photo");
    let signature = localStorage.getItem("signature");

    if (photo) {
        document.getElementById("ticketPhoto").src = photo;
    } else {
        document.getElementById("ticketPhoto").alt = "Photo not available";
    }

    if (signature) {
        document.getElementById("ticketSignature").src = signature;
    } else {
        document.getElementById("ticketSignature").alt = "Signature not available";
    }

    document.getElementById("hallTicket").style.display = "block";
}

// Register User
async function registerUser(fullName, email, password, photo, signature) {
    const response = await fetch('http://localhost:5000/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ fullName, email, password, photo, signature }),
    });
    return response.json();
  }
  
  // Login User
  async function loginUser(email, password) {
    const response = await fetch('http://localhost:5000/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    return response.json();
  }
  
  // Save Exam Details
  async function saveExamDetails(userId, examType, branch, examDate) {
    const response = await fetch('http://localhost:5000/exam-details', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, examType, branch, examDate }),
    });
    return response.json();
  }
  
  // Verify Payment
  async function verifyPayment(userId, transactionId) {
    const response = await fetch('http://localhost:5000/verify-payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, transactionId }),
    });
    return response.json();
  }
  // Function to generate a random 6-digit Hall Ticket Number
function generateHallTicketNumber() {
    return Math.floor(100000 + Math.random() * 900000); // 6-digit number
}

// Assign HNum dynamically to the Hall Ticket
document.addEventListener("DOMContentLoaded", function () {
    let hallTicketNumber = generateHallTicketNumber(); // Generate a unique number
    document.getElementById("hall-ticket-number").innerText = hallTicketNumber;
});
