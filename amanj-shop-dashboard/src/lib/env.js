// src/lib/env.js
// Environment variable validation

const requiredEnvVars = {
  NEXT_PUBLIC_STRAPI_URL: {
    required: true,
    default: "http://localhost:1337",
    description: "Strapi backend URL",
  },
  NEXT_PUBLIC_STRAPI_API_TOKEN: {
    required: false,
    description: "Strapi API token",
  },
  ADMIN_PHONES: {
    required: true,
    description: "Comma-separated list of admin phone numbers for SMS",
    validate: (value) => {
      const phones = value.split(",").map((p) => p.trim());
      const phoneRegex = /^09\d{9}$/;
      for (const phone of phones) {
        if (!phoneRegex.test(phone)) {
          return `Invalid phone number format: ${phone}. Must be 09XXXXXXXXX`;
        }
      }
      return null;
    },
  },
  CSRF_SECRET: {
    required: true,
    description: "Secret key for CSRF token generation",
    validate: (value) => {
      if (value.length < 32) {
        return "CSRF_SECRET must be at least 32 characters long";
      }
      return null;
    },
  },
  FARAZSMS_FROM: {
    required: false,
    description: "Faraz SMS sender number",
  },
  FARAZSMS_PATTERN_CODE: {
    required: false,
    description: "Faraz SMS pattern code",
  },
  FARAZSMS_APIKEY: {
    required: false,
    description: "Faraz SMS API key",
  },
};

/**
 * Validate environment variables
 * @returns {{ valid: boolean, errors: string[], warnings: string[] }}
 */
export function validateEnv() {
  const errors = [];
  const warnings = [];

  for (const [name, config] of Object.entries(requiredEnvVars)) {
    const value = process.env[name];

    if (!value && config.required) {
      if (config.default) {
        // Use default value in development
        if (process.env.NODE_ENV === "development") {
          process.env[name] = config.default;
          warnings.push(
            `${name} not set, using default value in development mode`
          );
        } else {
          errors.push(`${name} is required but not set`);
        }
      } else {
        errors.push(`${name} is required but not set`);
      }
    }

    if (value && config.validate) {
      const error = config.validate(value);
      if (error) {
        errors.push(error);
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Get environment variable with validation
 * @param {string} name - Environment variable name
 * @param {*} defaultValue - Default value if not set
 * @returns {*}
 */
export function getEnv(name, defaultValue = undefined) {
  const value = process.env[name];
  if (!value) return defaultValue;
  return value;
}

/**
 * Check if running in production
 */
export function isProduction() {
  return process.env.NODE_ENV === "production";
}

/**
 * Check if running in development
 */
export function isDevelopment() {
  return process.env.NODE_ENV === "development";
}
