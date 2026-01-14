const uppercaseChars = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"];
const lowercaseChars = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z"];
const numberChars = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
const symbolChars = ["~","`","!","@","#","$","%","^","&","*","(",")","_","-","+","=","{","[","}","]",",","|",":",";","<",">",".","?","/"];

let passwordOneEl = document.getElementById("password-one")
let passwordTwoEl = document.getElementById("password-two")
let toast = document.getElementById("toast") // Make sure you have this ID in your HTML
let lengthSlider = document.getElementById("length-slider")
let lengthVal = document.getElementById("length-val")

lengthSlider.addEventListener("input", function() {
    passwordLength = lengthSlider.value
    lengthVal.textContent = passwordLength
})

function genpassword() {
    passwordOneEl.value = getRandomPassword()
    passwordTwoEl.value = getRandomPassword()
    updateStrength();
}

function getRandomPassword() {
    let charset = "";
    if (document.getElementById("uppercase-cb").checked) charset += uppercaseChars.join("");
    if (document.getElementById("lowercase-cb").checked) charset += lowercaseChars.join("");
    if (document.getElementById("numbers-cb").checked) charset += numberChars.join("");
    if (document.getElementById("symbols-cb").checked) charset += symbolChars.join("");

    if (charset === "") {
        showToast("Please select at least one option!", true); 
        return "";
    }

    let password = "";
    for (let i = 0; i < passwordLength; i++) {
        let randomIndex = Math.floor(Math.random() * charset.length);
        password += charset[randomIndex];
    }
    return password;
}

function copyToClipboard(elementId) {
    const inputField = document.getElementById(elementId);
    const textToCopy = inputField.value;

    if (textToCopy) {
        navigator.clipboard.writeText(textToCopy).then(() => {
        showToast("Password copied to clipboard!", false);
        });
    }
}

// TOAST NOTIFICATION LOGIC
function showToast(message, isError = false) {
    toast.innerHTML = isError 
        ? `<span class="error-icon">⚠️</span> ${message}` 
        : `<span class="checkmark">✔</span> ${message}`;
    
    // 2. Change color if it's an error
    if (isError) {
        toast.style.backgroundColor = "rgba(220, 53, 69, 0.9)"; // Reddish for errors
    } else {
        toast.style.backgroundColor = "rgba(40, 45, 49, 0.85)"; // Original dark grey
    }

    // 3. Show it
    toast.classList.add("show");
    
    setTimeout(() => {
        toast.classList.remove("show");
    }, 3000);
}
function updateStrength() {
    const bar = document.getElementById("strength-bar");
    const text = document.getElementById("strength-text");
    
    let score = 0;
    
    // Check for variety (1 point each)
    if (document.getElementById("uppercase-cb").checked) score += 1;
    if (document.getElementById("lowercase-cb").checked) score += 1;
    if (document.getElementById("numbers-cb").checked) score += 1;
    if (document.getElementById("symbols-cb").checked) score += 1;

    // Check for length (Bonus points)
    if (passwordLength >= 14) {
        score += 1; // High security length
    }

    // MAP SCORE TO UI (0 to 5)
    // 0-1: Weak (Red)
    // 2-3: Medium (Yellow)
    // 4-5: Strong (Green)
    
    if (score === 5) {
        bar.style.width = "100%";
        bar.style.backgroundColor = "#6BCB77"; // Green
        text.textContent = "Strong (Secure)";
    } else if (score >= 3) {
        bar.style.width = "66%";
        bar.style.backgroundColor = "#ffd93d"; // Yellow
        text.textContent = "Medium";
    } else {
        bar.style.width = "33%";
        bar.style.backgroundColor = "#ff4d4d"; // Red
        text.textContent = "Weak";
    }
}
// IMPORTANT: Call this function inside your genpassword() function 
// so it updates every time you click "Generate"