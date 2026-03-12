/**
 * meetingUtils.js
 * Helpers for room link validation, expiry, and route params.
 */

export const BASE_URL   = "https://speaksync.app/room/";
export const ROOM_REGEX = /^ss-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}$/;

// Links are valid for 24 hours (stored in localStorage when generated)
const EXPIRY_MS = 24 * 60 * 60 * 1000;

/**
 * Generate a new room ID and persist its creation time.
 * @returns {{ roomId: string, link: string }}
 */
export function createRoom() {
  const seg  = () => Math.random().toString(36).slice(2, 6);
  const roomId = `ss-${seg()}-${seg()}-${seg()}`;
  // Persist creation time so we can check expiry
  try {
    const rooms = JSON.parse(localStorage.getItem("speaksync_rooms") || "{}");
    rooms[roomId] = Date.now();
    localStorage.setItem("speaksync_rooms", JSON.stringify(rooms));
  } catch (_) { /* localStorage unavailable */ }
  return { roomId, link: BASE_URL + roomId };
}

/**
 * Extract the room ID from a full link or bare ID.
 * @param {string} input
 * @returns {string|null}
 */
export function extractRoomId(input = "") {
  const trimmed = input.trim();
  if (ROOM_REGEX.test(trimmed)) return trimmed;
  if (trimmed.startsWith(BASE_URL)) {
    const id = trimmed.replace(BASE_URL, "");
    if (ROOM_REGEX.test(id)) return id;
  }
  return null;
}

/**
 * Check whether a room link/ID is valid and not expired.
 * @param {string} input
 * @returns {{ valid: boolean, roomId: string|null, reason: string }}
 */
export function validateRoomLink(input = "") {
  const roomId = extractRoomId(input);
  if (!roomId) {
    return { valid: false, roomId: null, reason: "Invalid link format." };
  }
  try {
    const rooms = JSON.parse(localStorage.getItem("speaksync_rooms") || "{}");
    const created = rooms[roomId];
    if (created && Date.now() - created > EXPIRY_MS) {
      return { valid: false, roomId, reason: "This meeting link has expired (24h limit)." };
    }
  } catch (_) { /* skip expiry check if storage unavailable */ }
  return { valid: true, roomId, reason: "" };
}

/**
 * Build the in-app route path for a meeting room.
 * e.g. "/room/ss-abcd-efgh-ijkl"
 * @param {string} roomId
 * @returns {string}
 */
export function roomPath(roomId) {
  return `/room/${roomId}`;
}