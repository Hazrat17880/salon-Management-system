/**
 * Generates a random OTP code
 * @param {number} length - Length of OTP (default: 6)
 * @returns {string} Generated OTP code
 */
function generateOTP(length = 6) {
  // Ensure the length is at least 4 and at most 8
  length = Math.max(4, Math.min(8, length));
  
  // Generate random digits
  let otp = '';
  for (let i = 0; i < length; i++) {
    otp += Math.floor(Math.random() * 10); // 0-9
  }
  
  return otp;
}

export default generateOTP