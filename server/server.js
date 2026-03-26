/**
 * server.js
 * ─────────────────────────────────────────────────────────────────────────────
 * SpeakSync — Signalling Server + TURN Credentials API
 *
 * Stack:  Node.js  +  Express  +  Socket.io  +  node-turn (coturn wrapper)
 *
 * Install:
 *   npm install express socket.io cors dotenv
 *   npm install node-turn          ← lightweight JS TURN server
 *   # OR install coturn system-wide and configure via env (recommended for prod)
 *
 * Environment variables (.env):
 *   PORT=5000
 *   CLIENT_URL=http://localhost:3000     # React dev server (CORS)
 *   TURN_SECRET=your_strong_secret_here  # shared HMAC secret for TURN credentials
 *   TURN_HOST=your-server-ip-or-domain   # public IP / domain of this server
 *   TURN_PORT=3478
 *   USE_COTURN=false                     # true = use system coturn, false = node-turn
 *
 * Run:
 *   node server.js
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * SIGNALLING FLOW
 * ─────────────────────────────────────────────────────────────────────────────
 *
 *  Participant A (already in room)       Participant B (joins via shared link)
 *  ─────────────────────────────         ────────────────────────────────────
 *  emit: join-room ──────────────────►  (nothing yet)
 *                                        emit: join-room
 *  ◄──────────────────── server: user-joined (B joined)
 *  createOffer()
 *  emit: offer ─────────────────────►
 *                                        handleOffer() → createAnswer()
 *                                        emit: answer ◄──────────────────
 *  setRemoteAnswer()
 *  ICE candidates trickle both ways ↔↔↔
 *  P2P connection established  🎉
 *
 * ─────────────────────────────────────────────────────────────────────────────
 */

"use strict";
require("dotenv").config();

const express    = require("express");
const http       = require("http");
const { Server } = require("socket.io");
const cors       = require("cors");
const crypto     = require("crypto");

// ── Config ────────────────────────────────────────────────────────────────────
const PORT        = process.env.PORT        || 5000;
const CLIENT_URL  = process.env.CLIENT_URL  || "http://localhost:3000";
const TURN_SECRET = process.env.TURN_SECRET || "speaksync_turn_secret_change_me";
const TURN_HOST   = process.env.TURN_HOST   || "127.0.0.1";
const TURN_PORT   = parseInt(process.env.TURN_PORT || "3478", 10);
const USE_COTURN  = process.env.USE_COTURN  === "true";

// ── Express setup ─────────────────────────────────────────────────────────────
const app    = express();
const server = http.createServer(app);

app.use(cors({ origin: CLIENT_URL, methods: ["GET", "POST"] }));
app.use(express.json());

// ── Socket.io setup ───────────────────────────────────────────────────────────
const io = new Server(server, {
  cors: {
    origin:  CLIENT_URL,
    methods: ["GET", "POST"],
  },
  transports:         ["websocket", "polling"],
  pingTimeout:        60000,
  pingInterval:       25000,
});

// ─────────────────────────────────────────────────────────────────────────────
// OPTIONAL: Built-in JS TURN server (node-turn)
// For production, replace with system coturn + this server just issues creds.
// ─────────────────────────────────────────────────────────────────────────────
if (!USE_COTURN) {
  try {
    const Turn = require("node-turn");
    const turnServer = new Turn({
      authMech:        "long-term",
      credentials:     {}, // We use HMAC time-based creds — populated dynamically
      listeningPort:   TURN_PORT,
      // listeningIps: [TURN_HOST],   // uncomment & set to your public IP in prod
      debugLevel:      "ERROR",
      realm:           "speaksync.app",
    });
    turnServer.start();
    console.log(`[TURN] Built-in TURN server started on port ${TURN_PORT}`);
  } catch (err) {
    console.warn("[TURN] node-turn not installed — TURN server not started.");
    console.warn("       Run: npm install node-turn");
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// REST: /api/ice-credentials
// Returns time-limited TURN credentials signed with TURN_SECRET.
// Client calls this on page load, passes result to webrtcService.init().
//
// This is the standard HMAC-based ephemeral credential mechanism used by
// coturn's REST API authentication — valid for 24 hours.
// ─────────────────────────────────────────────────────────────────────────────
app.get("/api/ice-credentials", (req, res) => {
  const ttl       = 24 * 3600;                          // 24 hours
  const timestamp = Math.floor(Date.now() / 1000) + ttl;
  const username  = `${timestamp}:speaksync`;
  const hmac      = crypto.createHmac("sha1", TURN_SECRET);
  hmac.update(username);
  const credential = hmac.digest("base64");

  res.json({
    turnConfig: {
      urls:       `turn:${TURN_HOST}:${TURN_PORT}`,
      username,
      credential,
    },
    ttl,
  });
});

// ── Health check ──────────────────────────────────────────────────────────────
app.get("/health", (_, res) => res.json({ status: "ok", rooms: rooms.size }));

// ─────────────────────────────────────────────────────────────────────────────
// ROOM STATE
// ─────────────────────────────────────────────────────────────────────────────
/**
 * rooms: Map<roomId, Set<{ socketId, userName }>>
 * We limit each room to 2 participants (1-to-1 call).
 */
const rooms = new Map();

function getRoomParticipants(roomId) {
  return rooms.get(roomId) ?? new Set();
}

function addParticipant(roomId, socketId, userName) {
  if (!rooms.has(roomId)) rooms.set(roomId, new Set());
  rooms.get(roomId).add({ socketId, userName });
}

function removeParticipant(roomId, socketId) {
  const participants = rooms.get(roomId);
  if (!participants) return;
  for (const p of participants) {
    if (p.socketId === socketId) {
      participants.delete(p);
      break;
    }
  }
  if (participants.size === 0) rooms.delete(roomId);
}

// ─────────────────────────────────────────────────────────────────────────────
// SOCKET.IO EVENTS
// ─────────────────────────────────────────────────────────────────────────────
io.on("connection", (socket) => {
  console.log(`[socket] Connected: ${socket.id}`);

  // ── join-room ──────────────────────────────────────────────────────────────
  socket.on("join-room", ({ roomId, userName }) => {
    const participants = getRoomParticipants(roomId);

    // 2-person limit
    if (participants.size >= 2) {
      socket.emit("room-full", { roomId });
      console.warn(`[room] ${roomId} is full. Rejected: ${socket.id}`);
      return;
    }

    socket.join(roomId);
    socket.data.roomId   = roomId;
    socket.data.userName = userName;
    addParticipant(roomId, socket.id, userName);

    console.log(`[room] ${userName} (${socket.id}) joined ${roomId}. Count: ${getRoomParticipants(roomId).size}`);

    // Notify the OTHER participant in the room (not the sender)
    // This triggers the existing participant to create an offer.
    socket.to(roomId).emit("user-joined", {
      socketId: socket.id,
      userName,
    });
  });

  // ── leave-room ─────────────────────────────────────────────────────────────
  socket.on("leave-room", ({ roomId }) => {
    _leaveRoom(socket, roomId);
  });

  // ── WebRTC: offer ──────────────────────────────────────────────────────────
  socket.on("offer", ({ roomId, offer }) => {
    // Relay to the other participant in the room
    socket.to(roomId).emit("offer", { offer });
  });

  // ── WebRTC: answer ─────────────────────────────────────────────────────────
  socket.on("answer", ({ roomId, answer }) => {
    socket.to(roomId).emit("answer", { answer });
  });

  // ── WebRTC: ICE candidate ──────────────────────────────────────────────────
  socket.on("ice-candidate", ({ roomId, candidate }) => {
    socket.to(roomId).emit("ice-candidate", { candidate });
  });

  // ── Chat message ───────────────────────────────────────────────────────────
  socket.on("chat-message", ({ roomId, text, sender, timestamp }) => {
    // Relay to the other participant only (sender sees their own message locally)
    socket.to(roomId).emit("chat-message", { text, sender, timestamp });
  });

  // ── Disconnect ─────────────────────────────────────────────────────────────
  socket.on("disconnect", (reason) => {
    console.log(`[socket] Disconnected: ${socket.id} (${reason})`);
    const roomId = socket.data?.roomId;
    if (roomId) _leaveRoom(socket, roomId);
  });
});

// ── Helper: handle a participant leaving a room ───────────────────────────────
function _leaveRoom(socket, roomId) {
  socket.leave(roomId);
  removeParticipant(roomId, socket.id);
  // Notify the remaining participant
  socket.to(roomId).emit("user-left", {
    socketId: socket.id,
    userName: socket.data?.userName ?? "Participant",
  });
  console.log(`[room] ${socket.id} left ${roomId}. Remaining: ${getRoomParticipants(roomId).size}`);
}

// ─────────────────────────────────────────────────────────────────────────────
// START
// ─────────────────────────────────────────────────────────────────────────────
server.listen(PORT, () => {
  console.log(`\n🚀 SpeakSync Signalling Server running on port ${PORT}`);
  console.log(`   CLIENT_URL : ${CLIENT_URL}`);
  console.log(`   TURN_HOST  : ${TURN_HOST}:${TURN_PORT}`);
  console.log(`   Mode       : ${USE_COTURN ? "coturn (external)" : "node-turn (built-in)"}\n`);
});