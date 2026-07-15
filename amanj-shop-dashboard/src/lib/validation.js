// src/lib/validation.js
// Input validation schemas and utilities

import {
  isValidEmail,
  isValidIranianPhone,
  isStrongPassword,
  isValidLength,
  isNotEmpty,
} from "./security";

/**
 * Validation result type
 * @typedef {{ valid: boolean, errors: string[] }} ValidationResult
 */

/**
 * Validate login input
 */
export function validateLoginInput(identifier, password) {
  const errors = [];
  
  if (!isNotEmpty(identifier)) {
    errors.push("Username or email is required");
  }
  
  if (!isNotEmpty(password)) {
    errors.push("Password is required");
  }
  
  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Validate registration input
 */
export function validateRegisterInput(username, email, password, confirmPassword) {
  const errors = [];
  
  if (!isNotEmpty(username)) {
    errors.push("Username is required");
  } else if (!isValidLength(username, 3, 50)) {
    errors.push("Username must be between 3 and 50 characters");
  }
  
  if (!isNotEmpty(email)) {
    errors.push("Email is required");
  } else if (!isValidEmail(email)) {
    errors.push("Invalid email format");
  }
  
  if (!isNotEmpty(password)) {
    errors.push("Password is required");
  } else if (!isStrongPassword(password)) {
    errors.push("Password must be at least 8 characters with letters and numbers");
  }
  
  if (password !== confirmPassword) {
    errors.push("Passwords do not match");
  }
  
  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Validate checkout input
 */
export function validateCheckoutInput(items, totalAmount, addressId) {
  const errors = [];
  
  if (!isNotEmpty(items)) {
    errors.push("Items are required");
  } else if (!Array.isArray(items)) {
    errors.push("Items must be an array");
  } else {
    items.forEach((item, index) => {
      if (!item.id) {
        errors.push(`Item ${index + 1} is missing an ID`);
      }
      if (!item.quantity || item.quantity <= 0) {
        errors.push(`Item ${index + 1} has invalid quantity`);
      }
    });
  }
  
  if (!totalAmount || totalAmount <= 0) {
    errors.push("Invalid total amount");
  }
  
  if (!isNotEmpty(addressId)) {
    errors.push("Address is required");
  }
  
  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Validate address input
 */
export function validateAddressInput(data) {
  const errors = [];
  
  if (!isNotEmpty(data.title)) {
    errors.push("Address title is required");
  }
  
  if (!isNotEmpty(data.province)) {
    errors.push("Province is required");
  }
  
  if (!isNotEmpty(data.city)) {
    errors.push("City is required");
  }
  
  if (!isNotEmpty(data.street)) {
    errors.push("Street address is required");
  }
  
  if (!isNotEmpty(data.postalCode)) {
    errors.push("Postal code is required");
  } else if (!/^\d{10}$/.test(data.postalCode)) {
    errors.push("Postal code must be 10 digits");
  }
  
  if (data.phone && !isValidIranianPhone(data.phone)) {
    errors.push("Invalid phone number format");
  }
  
  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Validate SMS input
 */
export function validateSmsInput(name, lastname, phone) {
  const errors = [];
  
  if (!isNotEmpty(name)) {
    errors.push("Name is required");
  }
  
  if (!isNotEmpty(lastname)) {
    errors.push("Last name is required");
  }
  
  if (!isNotEmpty(phone)) {
    errors.push("Phone number is required");
  } else if (!isValidIranianPhone(phone)) {
    errors.push("Invalid Iranian phone number format (09XXXXXXXXX)");
  }
  
  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Validate product input
 */
export function validateProductInput(data) {
  const errors = [];
  
  if (!isNotEmpty(data.name)) {
    errors.push("Product name is required");
  }
  
  if (data.price !== undefined && data.price < 0) {
    errors.push("Price cannot be negative");
  }
  
  if (data.stock !== undefined && data.stock < 0) {
    errors.push("Stock cannot be negative");
  }
  
  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Generic validation helper
 * @param {Object} data - Data to validate
 * @param {Object} rules - Validation rules
 * @returns {ValidationResult}
 */
export function validate(data, rules) {
  const errors = [];
  
  for (const [field, fieldRules] of Object.entries(rules)) {
    const value = data[field];
    
    for (const rule of fieldRules) {
      if (rule.required && !isNotEmpty(value)) {
        errors.push(`${field} is required`);
      }
      
      if (rule.minLength && typeof value === "string" && value.length < rule.minLength) {
        errors.push(`${field} must be at least ${rule.minLength} characters`);
      }
      
      if (rule.maxLength && typeof value === "string" && value.length > rule.maxLength) {
        errors.push(`${field} must be at most ${rule.maxLength} characters`);
      }
      
      if (rule.pattern && typeof value === "string" && !rule.pattern.test(value)) {
        errors.push(rule.message || `${field} format is invalid`);
      }
      
      if (rule.custom && typeof rule.custom === "function") {
        const customError = rule.custom(value, data);
        if (customError) {
          errors.push(customError);
        }
      }
    }
  }
  
  return {
    valid: errors.length === 0,
    errors,
  };
}
