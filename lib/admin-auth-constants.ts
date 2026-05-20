// Shared constants used by both the Edge middleware and the server-only auth module.
// This file must NOT import any Node.js or server-only modules.
export const SESSION_COOKIE = "studio_admin_session";
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days in seconds
