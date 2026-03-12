/**
 * socketService.js
 * ─────────────────────────────────────────────────────────────────────────────
 * SpeakSync — WebSocket / Socket.io Service (Stub)
 *
 * PURPOSE:
 *   Manages the real-time signalling channel between participants using
 *   Socket.io. Handles WebRTC signalling (offer/answer/ICE) and in-call
 *   text chat messages. This file is a stub — all event names, emit helpers,
 *   and listener hooks are defined but no Socket.io logic is wired yet.
 *
 * RESPONSIBILITIES (to be implemented):
 *   1. Connect to the Node.js/Express + Socket.io backend
 *   2. Join a room by roomId
 *   3. Emit & receive WebRTC signalling events (offer, answer, ice-candidate)
 *   4. Emit & receive chat messages
 *   5. Notify when the remote participant joins or leaves
 *   6. Handle reconnection and disconnection gracefully
 *
 * USAGE (future):
 *   import socketService from "./socketService";
 *   socketService.connect(SOCKET_URL);
 *   socketService.joinRoom(roomId, userName);
 *   socketService.onOffer(handler);
 *   socketService.sendOffer(roomId, offer);
 *   socketService.onChatMessage(handler);
 *   socketService.sendChat(roomId, message);
 *   socketService.disconnect();
 * ─────────────────────────────────────────────────────────────────────────────
 */

// ── Constants — Socket event names ───────────────────────────────────────────
// Keep these in sync with your backend event names.

export const EVENTS = {
  // Connection
  CONNECT:          "connect",
  DISCONNECT:       "disconnect",

  // Room lifecycle
  JOIN_ROOM:        "join-room",       // client → server
  USER_JOINED:      "user-joined",     // server → client (remote peer arrived)
  USER_LEFT:        "user-left",       // server → client (remote peer left)

  // WebRTC signalling
  OFFER:            "offer",           // client ↔ server ↔ client
  ANSWER:           "answer",          // client ↔ server ↔ client
  ICE_CANDIDATE:    "ice-candidate",   // client ↔ server ↔ client

  // Chat
  CHAT_MESSAGE:     "chat-message",    // client ↔ server ↔ client

  // Translation (future — fired after translation API responds)
  TRANSLATED_AUDIO: "translated-audio",
};


// ── Internal state ────────────────────────────────────────────────────────────

let socket = null;   // Socket.io client instance (io(...) result)


// ── Core API ─────────────────────────────────────────────────────────────────

/**
 * connect()
 * Initialises the Socket.io connection to the backend.
 *
 * @param {string}   serverUrl  - e.g. "http://localhost:5000"
 * @param {Function} onConnect     - Called when socket connects successfully
 * @param {Function} onDisconnect  - Called when socket disconnects
 * @returns {void}
 */
export function connect(serverUrl, onConnect, onDisconnect) {
  // TODO: import { io } from "socket.io-client"
  // TODO: socket = io(serverUrl, { transports: ["websocket"] })
  // TODO: socket.on(EVENTS.CONNECT, onConnect)
  // TODO: socket.on(EVENTS.DISCONNECT, onDisconnect)
  console.warn("[socketService] connect() — not yet implemented");
}

/**
 * disconnect()
 * Closes the socket connection.
 */
export function disconnect() {
  // TODO: socket?.disconnect()
  // TODO: socket = null
  console.warn("[socketService] disconnect() — not yet implemented");
}

/**
 * joinRoom()
 * Emits a join-room event so the server adds this socket to the room.
 *
 * @param {string} roomId    - The unique meeting room ID (e.g. "ss-xxxx-xxxx-xxxx")
 * @param {string} userName  - Display name of the local participant
 */
export function joinRoom(roomId, userName) {
  // TODO: socket.emit(EVENTS.JOIN_ROOM, { roomId, userName })
  console.warn("[socketService] joinRoom() — not yet implemented");
}

/**
 * onUserJoined()
 * Registers a callback for when the remote participant joins the room.
 *
 * @param {Function} handler - Called with ({ socketId, userName })
 */
export function onUserJoined(handler) {
  // TODO: socket.on(EVENTS.USER_JOINED, handler)
  console.warn("[socketService] onUserJoined() — not yet implemented");
}

/**
 * onUserLeft()
 * Registers a callback for when the remote participant leaves the room.
 *
 * @param {Function} handler - Called with ({ socketId, userName })
 */
export function onUserLeft(handler) {
  // TODO: socket.on(EVENTS.USER_LEFT, handler)
  console.warn("[socketService] onUserLeft() — not yet implemented");
}

// ── WebRTC Signalling ─────────────────────────────────────────────────────────

/**
 * sendOffer()
 * Emits the local SDP offer to the remote peer via the server.
 *
 * @param {string}                    roomId - Target room
 * @param {RTCSessionDescriptionInit} offer  - SDP offer from webrtcService.createOffer()
 */
export function sendOffer(roomId, offer) {
  // TODO: socket.emit(EVENTS.OFFER, { roomId, offer })
  console.warn("[socketService] sendOffer() — not yet implemented");
}

/**
 * onOffer()
 * Listens for an incoming SDP offer from the remote peer.
 *
 * @param {Function} handler - Called with (RTCSessionDescriptionInit)
 */
export function onOffer(handler) {
  // TODO: socket.on(EVENTS.OFFER, ({ offer }) => handler(offer))
  console.warn("[socketService] onOffer() — not yet implemented");
}

/**
 * sendAnswer()
 * Emits the local SDP answer back to the caller.
 *
 * @param {string}                    roomId - Target room
 * @param {RTCSessionDescriptionInit} answer - SDP answer from webrtcService.handleOffer()
 */
export function sendAnswer(roomId, answer) {
  // TODO: socket.emit(EVENTS.ANSWER, { roomId, answer })
  console.warn("[socketService] sendAnswer() — not yet implemented");
}

/**
 * onAnswer()
 * Listens for the remote peer's SDP answer.
 *
 * @param {Function} handler - Called with (RTCSessionDescriptionInit)
 */
export function onAnswer(handler) {
  // TODO: socket.on(EVENTS.ANSWER, ({ answer }) => handler(answer))
  console.warn("[socketService] onAnswer() — not yet implemented");
}

/**
 * sendIceCandidate()
 * Forwards a local ICE candidate to the remote peer.
 *
 * @param {string}               roomId    - Target room
 * @param {RTCIceCandidateInit}  candidate - ICE candidate from webrtcService.onIceCandidate
 */
export function sendIceCandidate(roomId, candidate) {
  // TODO: socket.emit(EVENTS.ICE_CANDIDATE, { roomId, candidate })
  console.warn("[socketService] sendIceCandidate() — not yet implemented");
}

/**
 * onIceCandidate()
 * Listens for ICE candidates from the remote peer.
 *
 * @param {Function} handler - Called with (RTCIceCandidateInit)
 */
export function onIceCandidate(handler) {
  // TODO: socket.on(EVENTS.ICE_CANDIDATE, ({ candidate }) => handler(candidate))
  console.warn("[socketService] onIceCandidate() — not yet implemented");
}


// ── Chat ──────────────────────────────────────────────────────────────────────

/**
 * sendChat()
 * Sends a text chat message to the room.
 *
 * @param {string} roomId  - Target room
 * @param {string} text    - Message text
 * @param {string} sender  - Display name of sender
 */
export function sendChat(roomId, text, sender) {
  // TODO: socket.emit(EVENTS.CHAT_MESSAGE, { roomId, text, sender, timestamp: Date.now() })
  console.warn("[socketService] sendChat() — not yet implemented");
}

/**
 * onChatMessage()
 * Listens for incoming chat messages from the remote participant.
 *
 * @param {Function} handler - Called with ({ text, sender, timestamp })
 */
export function onChatMessage(handler) {
  // TODO: socket.on(EVENTS.CHAT_MESSAGE, handler)
  console.warn("[socketService] onChatMessage() — not yet implemented");
}


// ── Utility ───────────────────────────────────────────────────────────────────

/**
 * isConnected()
 * @returns {boolean}
 */
export function isConnected() {
  // TODO: return socket?.connected ?? false
  return false;
}

/**
 * getSocketId()
 * @returns {string|null}
 */
export function getSocketId() {
  // TODO: return socket?.id ?? null
  return null;
}


// ── Default export ────────────────────────────────────────────────────────────
const socketService = {
  connect,
  disconnect,
  joinRoom,
  onUserJoined,
  onUserLeft,
  sendOffer,
  onOffer,
  sendAnswer,
  onAnswer,
  sendIceCandidate,
  onIceCandidate,
  sendChat,
  onChatMessage,
  isConnected,
  getSocketId,
  EVENTS,
};

export default socketService;