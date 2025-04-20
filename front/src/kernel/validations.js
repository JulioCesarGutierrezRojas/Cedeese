/**
 * Validates an email address format
 * @param {string} email - The email to validate
 * @returns {boolean} - True if email is valid, false otherwise
 */
export const validateEmail = (email) => {
    if (!email || email.trim() === '') return false;
    
    // Basic email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

/**
 * Validates a password meets security requirements
 * @param {string} password - The password to validate
 * @returns {boolean} - True if password is valid, false otherwise
 */
export const validatePassword = (password) => {
    if (!password || password.trim() === '') return false;
    
    // Password must have at least 8 characters, one uppercase, one lowercase, 
    // one number, one special character, and no spaces
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
};