/**
 * socketService.js
 * ─────────────────────────────────────────────────────────────────────────────
 * SpeakSync — WebSocket / Socket.io Service (FULL IMPLEMENTATION)
 *
 * Manages the real-time signalling channel for:
 *   1. Room join / leave notifications
 *   2. WebRTC signalling (offer → answer → ICE trickle)
 *   3. In-call chat messages
 *   4. Reconnection with exponential back-off
 *
 * DEPENDENCY: socket.io-client
 *   npm install socket.io-client
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { io } from "socket.io-client";

// ── Event names (keep in sync with signalling server) ────────────────────────
export const EVENTS = {
  // Connection
  CONNECT:          "connect",
  DISCONNECT:       "disconnect",
  CONNECT_ERROR:    "connect_error",

  // Room lifecycle
  JOIN_ROOM:        "join-room",       // client → server
  LEAVE_ROOM:       "leave-room",      // client → server
  USER_JOINED:      "user-joined",     // server → client  { socketId, userName }
  USER_LEFT:        "user-left",       // server → client  { socketId, userName }
  ROOM_FULL:        "room-full",       // server → client  (2-person rooms only)

  // WebRTC signalling
  OFFER:            "offer",           // client ↔ server ↔ client  { offer }
  ANSWER:           "answer",          // client ↔ server ↔ client  { answer }
  ICE_CANDIDATE:    "ice-candidate",   // client ↔ server ↔ client  { candidate }

  // Chat
  CHAT_MESSAGE:     "chat-message",    // client ↔ server ↔ client  { text, sender, timestamp }

  // Translation (future — emitted by server after STT/translate pipeline)
  TRANSLATED_AUDIO: "translated-audio",
};

// ── Internal state ────────────────────────────────────────────────────────────
let socket   = null;   // socket.io client instance
let _roomId  = null;   // current room we're in
let _userName = null;

// ─────────────────────────────────────────────────────────────────────────────
// CORE CONNECTION
// ─────────────────────────────────────────────────────────────────────────────

/**
 * connect()
 * Opens a Socket.io connection to the signalling server.
 *
 * @param {string}   serverUrl      e.g. "https://your-signal-server.com"
 * @param {Function} onConnect      () => void
 * @param {Function} onDisconnect   (reason: string) => void
 * @param {Function} onError        (err: Error) => void
 */
export function connect(serverUrl, onConnect, onDisconnect, onError) {
  if (socket?.connected) return;

  socket = io(serverUrl, {
    transports:         ["websocket", "polling"], // websocket first, fallback to polling
    reconnection:       true,
    reconnectionDelay:  1000,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: 10,
    timeout:            20000,
  });

  socket.on(EVENTS.CONNECT, () => {
    console.log("[socketService] Connected. Socket ID:", socket.id);
    onConnect?.();
  });

  socket.on(EVENTS.DISCONNECT, (reason) => {
    console.warn("[socketService] Disconnected:", reason);
    onDisconnect?.(reason);
  });

  socket.on(EVENTS.CONNECT_ERROR, (err) => {
    console.error("[socketService] Connection error:", err.message);
    onError?.(err);
  });
}

/**
 * disconnect()
 * Gracefully closes the socket.
 */
export function disconnect() {
  if (!socket) return;
  if (_roomId) socket.emit(EVENTS.LEAVE_ROOM, { roomId: _roomId });
  socket.disconnect();
  socket    = null;
  _roomId   = null;
  _userName = null;
  console.log("[socketService] Disconnected.");
}

// ─────────────────────────────────────────────────────────────────────────────
// ROOM LIFECYCLE
// ─────────────────────────────────────────────────────────────────────────────

/**
 * joinRoom()
 * Emits join-room so the server adds this socket to the room.
 * The server will emit USER_JOINED to the other participant.
 *
 * @param {string} roomId
 * @param {string} userName
 */
export function joinRoom(roomId, userName) {
  _roomId   = roomId;
  _userName = userName;
  socket.emit(EVENTS.JOIN_ROOM, { roomId, userName });
  console.log(`[socketService] Joining room: ${roomId} as ${userName}`);
}

/**
 * onUserJoined()
 * Called when the remote participant enters the room.
 * → Triggers offer creation (caller side).
 *
 * @param {Function} handler  ({ socketId, userName }) => void
 */
export function onUserJoined(handler) {
  socket.on(EVENTS.USER_JOINED, handler);
}

/**
 * onUserLeft()
 * Called when the remote participant disconnects.
 *
 * @param {Function} handler  ({ socketId, userName }) => void
 */
export function onUserLeft(handler) {
  socket.on(EVENTS.USER_LEFT, handler);
}

/**
 * onRoomFull()
 * Server emits this when a 3rd person tries to join a 2-participant room.
 *
 * @param {Function} handler () => void
 */
export function onRoomFull(handler) {
  socket.on(EVENTS.ROOM_FULL, handler);
}

// ─────────────────────────────────────────────────────────────────────────────
// WEBRTC SIGNALLING
// ─────────────────────────────────────────────────────────────────────────────

/**
 * sendOffer()
 * @param {string}                    roomId
 * @param {RTCSessionDescriptionInit} offer
 */
export function sendOffer(roomId, offer) {
  socket.emit(EVENTS.OFFER, { roomId, offer });
}

/**
 * onOffer()
 * @param {Function} handler  (RTCSessionDescriptionInit) => void
 */
export function onOffer(handler) {
  socket.on(EVENTS.OFFER, ({ offer }) => handler(offer));
}

/**
 * sendAnswer()
 * @param {string}                    roomId
 * @param {RTCSessionDescriptionInit} answer
 */
export function sendAnswer(roomId, answer) {
  socket.emit(EVENTS.ANSWER, { roomId, answer });
}

/**
 * onAnswer()
 * @param {Function} handler  (RTCSessionDescriptionInit) => void
 */
export function onAnswer(handler) {
  socket.on(EVENTS.ANSWER, ({ answer }) => handler(answer));
}

/**
 * sendIceCandidate()
 * @param {string}              roomId
 * @param {RTCIceCandidateInit} candidate
 */
export function sendIceCandidate(roomId, candidate) {
  socket.emit(EVENTS.ICE_CANDIDATE, { roomId, candidate });
}

/**
 * onIceCandidate()
 * @param {Function} handler  (RTCIceCandidateInit) => void
 */
export function onIceCandidate(handler) {
  socket.on(EVENTS.ICE_CANDIDATE, ({ candidate }) => handler(candidate));
}

// ─────────────────────────────────────────────────────────────────────────────
// CHAT
// ─────────────────────────────────────────────────────────────────────────────

/**
 * sendChat()
 * @param {string} roomId
 * @param {string} text
 * @param {string} sender  Display name
 */
export function sendChat(roomId, text, sender) {
  socket.emit(EVENTS.CHAT_MESSAGE, { roomId, text, sender, timestamp: Date.now() });
}

/**
 * onChatMessage()
 * @param {Function} handler  ({ text, sender, timestamp }) => void
 */
export function onChatMessage(handler) {
  socket.on(EVENTS.CHAT_MESSAGE, handler);
}

// ─────────────────────────────────────────────────────────────────────────────
// REMOVE LISTENERS (important on cleanup to avoid duplicate listeners)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * off()
 * Removes a specific listener for an event.
 *
 * @param {string}   event
 * @param {Function} [handler]  If omitted, removes ALL listeners for the event
 */
export function off(event, handler) {
  if (!socket) return;
  if (handler) {
    socket.off(event, handler);
  } else {
    socket.off(event);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// UTILITY
// ─────────────────────────────────────────────────────────────────────────────

export function isConnected()  { return socket?.connected ?? false; }
export function getSocketId()  { return socket?.id ?? null; }
export function getRoomId()    { return _roomId; }

// ── Default export ────────────────────────────────────────────────────────────
const socketService = {
  connect, disconnect,
  joinRoom, onUserJoined, onUserLeft, onRoomFull,
  sendOffer, onOffer,
  sendAnswer, onAnswer,
  sendIceCandidate, onIceCandidate,
  sendChat, onChatMessage,
  off,
  isConnected, getSocketId, getRoomId,
  EVENTS,
};
export default socketService;