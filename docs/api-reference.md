# API Reference

## Overview

AlgoBuddy uses Next.js Route Handlers for API endpoints. All API routes are located in `src/app/api/`.

## Authentication

Most endpoints require authentication. Use the `Authorization: Bearer <supabase-access-token>` header.

### Auth Status
```
GET /api/auth
```
Returns the current user's authentication status.

**Response:**
```json
{
  "authenticated": true,
  "user": {
    "id": "uuid",
    "email": "user@example.com"
  }
}
```

### CSRF Token
```
GET /api/csrf-token
```
Returns a CSRF token for state-changing requests. Token is also set as an HTTP-only cookie.

**Response:**
```json
{
  "csrfToken": "random.signed-value"
}
```

## User Progress

### Get Progress
```
GET /api/progress
```
Returns the authenticated user's module progress.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "progress": {
    "module-id-1": { "status": "Completed" },
    "module-id-2": { "status": "In Progress" }
  }
}
```

### Update Progress
```
POST /api/progress
```
Updates progress for a specific module.

**Headers:** `Authorization: Bearer <token>`, `X-CSRF-Token: <token>`

**Body:**
```json
{
  "problemId": "sorting-bubble",
  "status": "Completed"
}
```

## AI Chatbot

### Send Message
```
POST /api/chatbot
```
Send a message to the AI assistant and get a response. Rate limited to 10 requests/min.

**Headers:** `Authorization: Bearer <token>`, `X-CSRF-Token: <token>`

**Body:**
```json
{
  "message": "Explain how Quick Sort works"
}
```

**Response:**
```json
{
  "reply": "Quick Sort is a divide-and-conquer algorithm...",
  "tokensUsed": 150
}
```

## Contact

### Submit Contact Form
```
POST /api/contact
```
Submits a contact form message. Protected by Turnstile CAPTCHA.

**Headers:** `X-CSRF-Token: <token>`

**Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "message": "I have a question about...",
  "captchaToken": "turnstile-token"
}
```

## Reviews

### Submit Review
```
POST /api/send-review
```
Submits a user review. Protected by Turnstile CAPTCHA.

**Headers:** `X-CSRF-Token: <token>`

**Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "rating": 5,
  "message": "Great platform!",
  "captchaToken": "turnstile-token"
}
```

## Code Lab

### Execute Code
```
POST /api/code-lab
```
Executes JavaScript code in a sandboxed environment.

**Headers:** `Authorization: Bearer <token>`, `X-CSRF-Token: <token>`

**Body:**
```json
{
  "code": "console.log('hello')"
}
```

**Response:**
```json
{
  "output": ["hello"],
  "executionTime": 5
}
```

## Algorithm Operations

### Get Algorithm Info
```
GET /api/algorithms/[category]/[algorithm]
```
Returns information about a specific algorithm.

**Example:** `GET /api/algorithms/sorting/bubble-sort`

## Rate Limiting

Rate limit headers are included in all API responses:

- `X-RateLimit-Limit` — Max requests per window
- `X-RateLimit-Remaining` — Remaining requests
- `X-RateLimit-Reset` — Unix timestamp when limit resets
- `Retry-After` — Seconds to wait (on 429 responses)

When rate limited, the API returns:
```json
{
  "error": "Too many requests",
  "message": "Rate limit exceeded. Please wait 30s.",
  "retryAfter": 30
}
```

## Error Responses

All errors follow a consistent format:

```json
{
  "error": "Human-readable error message",
  "code": "ERROR_CODE"
}
```

Common error codes:
- `AUTH_ERROR` (401) — Authentication required
- `VALIDATION_ERROR` (400) — Invalid input
- `RATE_LIMIT` (429) — Too many requests
- `CONFIG_ERROR` (500) — Server configuration error
- `CAPTCHA_CONFIG_MISSING` (500) — Turnstile not configured
- `CSRF_TOKEN_MISSING` (403) — CSRF token required
