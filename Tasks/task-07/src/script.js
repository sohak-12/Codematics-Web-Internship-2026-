// --- Task 1: Age to Days (Using Calendar) ---
document.getElementById('dob').addEventListener('change', function() {
    const birthDate = new Date(this.value);
    const today = new Date();
    const timeDiff = today - birthDate;
    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    document.getElementById('ageResult').innerText = days > 0 ? `Total Days: ${days}` : "Please select a past date";
});

// --- Task 2: Hours to Seconds ---
document.getElementById('hrs').addEventListener('input', function() {
    const hours = parseFloat(this.value);
    document.getElementById('hrsResult').innerText = `Seconds: ${hours * 3600}`;
});

// --- Task 3: Next Number Finder (Two Scenarios) ---
const presetArray = [10, 20, 30, 40, 50];

// Scenario A: Finding next number in an array
function findNextInArray() {
    const inputField = document.getElementById('arrayNum');
    const display = document.getElementById('nextResult');
    
    // Convert string input to actual number for comparison
    const userVal = parseInt(inputField.value);
    
    // Find the position (index) of that number in our array
    const currentIndex = presetArray.indexOf(userVal);

    if (currentIndex === -1) {
        display.innerText = "Error: Number not found in array.";
    } else if (currentIndex === presetArray.length - 1) {
        display.innerText = "Error: This is the last number, nothing comes next.";
    } else {
        const nextNum = presetArray[currentIndex + 1];
        display.innerText = `Success: The number after ${userVal} is ${nextNum}`;
    }
}

// Scenario B: Logic based on Integer or Float
function findNextSingle() {
    const val = document.getElementById('singleNum').value;
    const display = document.getElementById('nextResult');

    if (val === "") {
        display.innerText = "Please enter a value.";
        return;
    }

    const num = parseFloat(val);

    // Logic: Check if the number has a remainder when divided by 1
    // If num % 1 is 0, it's an integer. If not, it's a float.
    if (num % 1 === 0) {
        // It's an Integer
        display.innerText = `Integer detected. Next number: ${num + 1}`;
    } else {
        // It's a Float
        // We use toFixed(2) to avoid weird JS math like 5.6000000000001
        const nextFloat = (num + 0.1).toFixed(2);
        display.innerText = `Float detected. Next value (+0.1): ${nextFloat}`;
    }
}

// --- Task 4: Name Capitalizer ---
function capitalizeName() {
    const inputField = document.getElementById('nameInput');
    const display = document.getElementById('nameResult');
    let name = inputField.value;

    if (name.length > 0) {
        // Step 1: Get first letter and uppercase it
        const firstLetter = name.charAt(0).toUpperCase();
        
        // Step 2: Get the rest of the name and lowercase it
        const restOfName = name.slice(1).toLowerCase();
        
        // Step 3: Combine them
        const result = firstLetter + restOfName;
        
        display.innerText = `Formatted: ${result}`;
    } else {
        // If the box is empty, reset the display
        display.innerText = "Formatted: -";
    }
}

// --- Task 5: BMI Calculator ---
function calculateBMI() {
    const w = parseFloat(document.getElementById('weight').value);
    const h = parseFloat(document.getElementById('height').value);
    if (w && h) {
        const bmi = (w / (h * h)).toFixed(2);
        document.getElementById('bmiResult').innerText = `Your BMI is: ${bmi}`;
    }
}

// --- Task 6: Random Array Generator ---
document.getElementById('generateArray').addEventListener('click', function() {
    // Generate array of 5 random numbers
    const randomArr = Array.from({length: 5}, () => Math.floor(Math.random() * 100));
    document.getElementById('arrayOutput').innerText = `Array: [${randomArr.join(', ')}]`;
    document.getElementById('firstElement').innerText = `First: ${randomArr[0]}`;
    document.getElementById('lastElement').innerText = `Last: ${randomArr[randomArr.length - 1]}`;
});

// --- Task 7: Addition (Event Handling & NaN Logic) ---
const box1 = document.getElementById('num1');
const box2 = document.getElementById('num2');
const resultBox = document.getElementById('sumResult');

function handleAddition() {
    const val1 = box1.value;
    const val2 = box2.value;

    if (val1 !== "" && val2 === "") {
        resultBox.value = "NaN"; // Show NaN if only first box is filled
    } else if (val1 !== "" && val2 !== "") {
        resultBox.value = parseInt(val1) + parseInt(val2);
    } else {
        resultBox.value = "";
    }
}

box1.addEventListener('input', handleAddition);
box2.addEventListener('input', handleAddition);