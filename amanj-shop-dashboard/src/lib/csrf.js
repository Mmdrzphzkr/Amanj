// src/lib/csrf.js
// CSRF protection utility

import { generateToken } from "./security";
import { serialize } from "cookie";

const CSRF_TOKEN_NAME = "csrf_token";
const CSRF_SECRET = process.env.CSRF_SECRET || "your-csrf-secret-key-change-in-production";

/**
 * Generate a CSRF token and set it in a cookie
 * @param {Response} response - The response object to set the cookie on
 * @returns {string} The generated CSRF token
 */
export function generateCsrfToken(response) {
  const token = generateToken(32);
  
  const cookie = serialize(CSRF_TOKEN_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60, // 1 hour
  });
  
  response.headers.append("Set-Cookie", cookie);
  return token;
}

/**
 * Validate a CSRF token from the request
 * @param {Request} request - The incoming request
 * @returns {boolean} Whether the token is valid
 */
export function validateCsrfToken(request) {
  // Get token from cookie
  const cookies = request.headers.get("cookie");
  if (!cookies) return false;
  
  const cookiePairs = cookies.split(";");
  let cookieToken = null;
  
  for (const pair of cookiePairs) {
    const [name, value] = pair.trim().split("=");
    if (name === CSRF_TOKEN_NAME) {
      cookieToken = value;
      break;
    }
  }
  
  if (!cookieToken) return false;
  
  // Get token from request body or header
  const bodyToken = request.headers.get("x-csrf-token");
  
  if (!bodyToken) return false;
  
  // Compare tokens
  return cookieToken === bodyToken;
}

/**
 * Middleware for CSRF protection
 * Use this in API routes that handle mutations
 */
export function withCsrf(handler) {
  return async (request, context) => {
    // Only check mutation methods
    if (["POST", "PUT", "DELETE", "PATCH"].includes(request.method)) {
      if (!validateCsrfToken(request)) {
        return new Response(
          JSON.stringify({ error: "Invalid CSRF token" }),
          {
            status: 403,
            headers: { "Content-Type": "application/json" },
          }
        );
      }
    }
    
    return handler(request, context);
  };
}
