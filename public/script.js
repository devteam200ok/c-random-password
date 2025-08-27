// Character sets for password generation
const CHARACTER_SETS = {
    uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    lowercase: 'abcdefghijklmnopqrstuvwxyz',
    numbers: '0123456789',
    symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?'
};

// DOM elements
let passwordDisplay = null;
let errorMessage = null;
let passwordOutput = null;
let copyMessage = null;

// Initialize DOM elements when page loads
document.addEventListener('DOMContentLoaded', function() {
    passwordDisplay = document.getElementById('passwordDisplay');
    errorMessage = document.getElementById('errorMessage');
    passwordOutput = document.getElementById('passwordOutput');
    copyMessage = document.getElementById('copyMessage');
});

/**
 * Generate a random password based on user preferences
 */
function generatePassword() {
    // Get user preferences
    const length = parseInt(document.getElementById('passwordLength').value);
    const includeUppercase = document.getElementById('includeUppercase').checked;
    const includeLowercase = document.getElementById('includeLowercase').checked;
    const includeNumbers = document.getElementById('includeNumbers').checked;
    const includeSymbols = document.getElementById('includeSymbols').checked;

    // Validate input
    if (length < 6 || length > 64) {
        showError('Password length must be between 6 and 64 characters.');
        return;
    }

    // Check if at least one character type is selected
    if (!includeUppercase && !includeLowercase && !includeNumbers && !includeSymbols) {
        showError('Please select at least one character type.');
        return;
    }

    // Build character pool based on selected options
    let characterPool = '';
    if (includeUppercase) characterPool += CHARACTER_SETS.uppercase;
    if (includeLowercase) characterPool += CHARACTER_SETS.lowercase;
    if (includeNumbers) characterPool += CHARACTER_SETS.numbers;
    if (includeSymbols) characterPool += CHARACTER_SETS.symbols;

    // Generate password
    let password = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characterPool.length);
        password += characterPool[randomIndex];
    }

    // Ensure password contains at least one character from each selected type
    password = ensureCharacterTypes(password, {
        includeUppercase,
        includeLowercase,
        includeNumbers,
        includeSymbols
    });

    // Display the generated password
    displayPassword(password);
    hideError();
}

/**
 * Ensure the password contains at least one character from each selected type
 */
function ensureCharacterTypes(password, options) {
    let newPassword = password;
    
    // Check and add uppercase if required
    if (options.includeUppercase && !/[A-Z]/.test(newPassword)) {
        const randomUppercase = CHARACTER_SETS.uppercase[Math.floor(Math.random() * CHARACTER_SETS.uppercase.length)];
        const randomPosition = Math.floor(Math.random() * newPassword.length);
        newPassword = newPassword.slice(0, randomPosition) + randomUppercase + newPassword.slice(randomPosition + 1);
    }
    
    // Check and add lowercase if required
    if (options.includeLowercase && !/[a-z]/.test(newPassword)) {
        const randomLowercase = CHARACTER_SETS.lowercase[Math.floor(Math.random() * CHARACTER_SETS.lowercase.length)];
        const randomPosition = Math.floor(Math.random() * newPassword.length);
        newPassword = newPassword.slice(0, randomPosition) + randomLowercase + newPassword.slice(randomPosition + 1);
    }
    
    // Check and add numbers if required
    if (options.includeNumbers && !/[0-9]/.test(newPassword)) {
        const randomNumber = CHARACTER_SETS.numbers[Math.floor(Math.random() * CHARACTER_SETS.numbers.length)];
        const randomPosition = Math.floor(Math.random() * newPassword.length);
        newPassword = newPassword.slice(0, randomPosition) + randomNumber + newPassword.slice(randomPosition + 1);
    }
    
    // Check and add symbols if required
    if (options.includeSymbols && !/[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(newPassword)) {
        const randomSymbol = CHARACTER_SETS.symbols[Math.floor(Math.random() * CHARACTER_SETS.symbols.length)];
        const randomPosition = Math.floor(Math.random() * newPassword.length);
        newPassword = newPassword.slice(0, randomPosition) + randomSymbol + newPassword.slice(randomPosition + 1);
    }
    
    return newPassword;
}

/**
 * Display the generated password
 */
function displayPassword(password) {
    if (passwordDisplay) {
        passwordDisplay.textContent = password;
        passwordOutput.style.display = 'block';
    }
}

/**
 * Show error message
 */
function showError(message) {
    if (errorMessage) {
        errorMessage.textContent = message;
        errorMessage.style.display = 'block';
        passwordOutput.style.display = 'none';
    }
}

/**
 * Hide error message
 */
function hideError() {
    if (errorMessage) {
        errorMessage.style.display = 'none';
    }
}

/**
 * Copy password to clipboard
 */
async function copyToClipboard() {
    if (!passwordDisplay || !passwordDisplay.textContent) {
        return;
    }

    try {
        await navigator.clipboard.writeText(passwordDisplay.textContent);
        showCopyMessage();
    } catch (err) {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = passwordDisplay.textContent;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        showCopyMessage();
    }
}

/**
 * Show copy success message
 */
function showCopyMessage() {
    if (copyMessage) {
        copyMessage.style.display = 'block';
        setTimeout(() => {
            copyMessage.style.display = 'none';
        }, 2000);
    }
}