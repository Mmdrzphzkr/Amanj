// src/lib/audit.js
// Audit logging utility for security events

/**
 * Audit event types
 */
export const AuditEventTypes = {
  // Authentication events
  LOGIN_SUCCESS: "LOGIN_SUCCESS",
  LOGIN_FAILURE: "LOGIN_FAILURE",
  LOGOUT: "LOGOUT",
  REGISTER: "REGISTER",
  PASSWORD_CHANGE: "PASSWORD_CHANGE",

  // Authorization events
  UNAUTHORIZED_ACCESS: "UNAUTHORIZED_ACCESS",
  ROLE_CHANGE: "ROLE_CHANGE",

  // Data events
  ORDER_CREATED: "ORDER_CREATED",
  ORDER_UPDATED: "ORDER_UPDATED",
  PRODUCT_CREATED: "PRODUCT_CREATED",
  PRODUCT_UPDATED: "PRODUCT_UPDATED",
  PRODUCT_DELETED: "PRODUCT_DELETED",
  ADDRESS_CREATED: "ADDRESS_CREATED",
  ADDRESS_UPDATED: "ADDRESS_UPDATED",

  // SMS events
  SMS_SENT: "SMS_SENT",
  SMS_FAILED: "SMS_FAILED",

  // Upload events
  FILE_UPLOADED: "FILE_UPLOADED",
  UPLOAD_FAILED: "UPLOAD_FAILED",

  // Security events
  RATE_LIMIT_EXCEEDED: "RATE_LIMIT_EXCEEDED",
  CSRF_VALIDATION_FAILED: "CSRF_VALIDATION_FAILED",
  INVALID_TOKEN: "INVALID_TOKEN",
  OPEN_REDIRECT_BLOCKED: "OPEN_REDIRECT_BLOCKED",
};

/**
 * Log an audit event
 * @param {string} eventType - Event type from AuditEventTypes
 * @param {Object} data - Event data
 * @param {Request} request - Optional request object for IP and user agent
 */
export function auditLog(eventType, data = {}, request = null) {
  const timestamp = new Date().toISOString();
  
  const logEntry = {
    timestamp,
    eventType,
    ...data,
  };

  // Add request metadata if available
  if (request) {
    logEntry.ip = getClientIp(request);
    logEntry.userAgent = request.headers.get("user-agent") || "unknown";
    logEntry.method = request.method;
    logEntry.url = request.url;
  }

  // In production, you would send this to a logging service
  // For now, we'll use structured console logging
  if (process.env.NODE_ENV === "production") {
    // Production: Send to logging service (e.g., Datadog, CloudWatch, etc.)
    // await sendToLoggingService(logEntry);
    console.log(JSON.stringify(logEntry));
  } else {
    // Development: Pretty print for debugging
    console.log("[AUDIT]", JSON.stringify(logEntry, null, 2));
  }
}

/**
 * Get client IP address from request
 */
function getClientIp(request) {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  
  const realIp = request.headers.get("x-real-ip");
  if (realIp) {
    return realIp;
  }
  
  return "unknown";
}

/**
 * Log authentication events
 */
export function logAuthEvent(eventType, userId, email, request, success = true) {
  auditLog(eventType, {
    userId,
    email,
    success,
  }, request);
}

/**
 * Log data modification events
 */
export function logDataEvent(eventType, userId, resourceType, resourceId, request) {
  auditLog(eventType, {
    userId,
    resourceType,
    resourceId,
  }, request);
}

/**
 * Log security events
 */
export function logSecurityEvent(eventType, request, details = {}) {
  auditLog(eventType, {
    ...details,
  }, request);
}
