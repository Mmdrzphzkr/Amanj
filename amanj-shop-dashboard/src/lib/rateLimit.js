// src/lib/rateLimit.js
// In-memory rate limiting utility

const rateLimitMap = new Map();

/**
 * Rate limiter middleware
 * @param {string} key - Unique identifier for the rate limit (e.g., IP, user ID)
 * @param {number} limit - Maximum number of requests allowed
 * @param {number} windowMs - Time window in milliseconds
 * @returns {{ allowed: boolean, remaining: number, resetTime: number }}
 */
export function rateLimit(key, limit = 10, windowMs = 60000) {
  const now = Date.now();
  
  if (!rateLimitMap.has(key)) {
    rateLimitMap.set(key, {
      count: 1,
      resetTime: now + windowMs,
    });
    return {
      allowed: true,
      remaining: limit - 1,
      resetTime: now + windowMs,
    };
  }
  
  const record = rateLimitMap.get(key);
  
  // Reset if window has passed
  if (now > record.resetTime) {
    record.count = 1;
    record.resetTime = now + windowMs;
    return {
      allowed: true,
      remaining: limit - 1,
      resetTime: record.resetTime,
    };
  }
  
  // Increment count
  record.count++;
  
  const allowed = record.count <= limit;
  const remaining = Math.max(0, limit - record.count);
  
  return {
    allowed,
    remaining,
    resetTime: record.resetTime,
  };
}

/**
 * Get client IP address from request
 */
export function getClientIp(request) {
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
 * Create rate limit response headers
 */
export function getRateLimitHeaders(remaining, resetTime) {
  return {
    "X-RateLimit-Remaining": remaining.toString(),
    "X-RateLimit-Reset": Math.ceil(resetTime / 1000).toString(),
  };
}

// Cleanup old entries every 5 minutes
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [key, record] of rateLimitMap.entries()) {
      if (now > record.resetTime) {
        rateLimitMap.delete(key);
      }
    }
  }, 5 * 60 * 1000);
}
