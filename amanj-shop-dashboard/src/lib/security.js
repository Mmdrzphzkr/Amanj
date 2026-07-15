// src/lib/security.js
// Security utilities for input validation, sanitization, and protection

/**
 * Validates if a URL is safe for redirect (prevents open redirect attacks)
 * Only allows relative paths on the same domain
 */
export function isSafeRedirect(url) {
  if (!url) return false;
  
  // Must start with / and not //
  if (!url.startsWith("/") || url.startsWith("//")) {
    return false;
  }
  
  // Must not contain protocol (http://, https://, etc.)
  if (url.includes("://")) {
    return false;
  }
  
  // Must not contain backslashes (Windows path traversal)
  if (url.includes("\\")) {
    return false;
  }
  
  // Must not contain null bytes
  if (url.includes("\0")) {
    return false;
  }
  
  // Must not contain encoded characters that could bypass checks
  if (url.includes("%") && (url.includes("0a") || url.includes("0d"))) {
    return false;
  }
  
  return true;
}

/**
 * Sanitizes a string to prevent XSS attacks
 * Removes HTML tags and encodes special characters
 */
export function sanitizeString(input) {
  if (typeof input !== "string") return input;
  
  return input
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;");
}

/**
 * Validates email format
 */
export function isValidEmail(email) {
  if (!email || typeof email !== "string") return false;
  
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
}

/**
 * Validates Iranian phone number format
 */
export function isValidIranianPhone(phone) {
  if (!phone || typeof phone !== "string") return false;
  
  // Iranian phone numbers: 09XXXXXXXXX (11 digits)
  const phoneRegex = /^09\d{9}$/;
  return phoneRegex.test(phone);
}

/**
 * Validates password strength
 */
export function isStrongPassword(password) {
  if (!password || typeof password !== "string") return false;
  
  // At least 8 characters
  if (password.length < 8) return false;
  
  // Must contain at least one letter and one number
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  
  return hasLetter && hasNumber;
}

/**
 * Validates string length
 */
export function isValidLength(input, min = 1, max = 1000) {
  if (typeof input !== "string") return false;
  return input.length >= min && input.length <= max;
}

/**
 * Sanitizes HTML content (basic XSS prevention)
 * For client-side use only
 */
export function sanitizeHtml(html) {
  if (typeof html !== "string") return "";
  
  return html
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/**
 * Validates and sanitizes JSON body size
 */
export function validateBodySize(body, maxSize = 1024 * 1024) { // 1MB default
  const bodyStr = JSON.stringify(body);
  if (bodyStr.length > maxSize) {
    return { valid: false, error: "Request body too large" };
  }
  return { valid: true };
}

/**
 * Generates a cryptographically secure random token
 */
export function generateToken(length = 32) {
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

/**
 * Validates that a value is not empty
 */
export function isNotEmpty(value) {
  if (value === null || value === undefined) return false;
  if (typeof value === "string") return value.trim().length > 0;
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === "object") return Object.keys(value).length > 0;
  return true;
}
