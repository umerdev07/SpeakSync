/**
 * webrtcService.js
 * ─────────────────────────────────────────────────────────────────────────────
 * SpeakSync — WebRTC Service (Stub)
 *
 * PURPOSE:
 *   Manages peer-to-peer audio/video communication between two participants
 *   using the WebRTC API. This file is a service stub — all function signatures,
 *   event hooks, and data structures are defined but no real WebRTC logic is
 *   implemented yet.
 *
 * RESPONSIBILITIES (to be implemented):
 *   1. Create and manage RTCPeerConnection
 *   2. Handle ICE candidate negotiation
 *   3. Create SDP offer / answer
 *   4. Attach local media stream (mic + camera)
 *   5. Receive and expose remote media stream
 *   6. Handle connection state changes (connecting, connected, disconnected)
 *   7. Gracefully close and clean up the peer connection
 *
 * USAGE (future):
 *   import webrtcService from "./webrtcService";
 *   await webrtcService.init(localStream, onRemoteStream, onStateChange);
 *   const offer = await webrtcService.createOffer();
 *   await webrtcService.setRemoteAnswer(answer);
 *   webrtcService.addIceCandidate(candidate);
 *   webrtcService.close();
 * ─────────────────────────────────────────────────────────────────────────────
 */

// ── Constants ─────────────────────────────────────────────────────────────────

/**
 * STUN/TURN server configuration used during ICE negotiation.
 * Replace with your own TURN server credentials in production.
 */
const ICE_SERVERS = {
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" },
    { urls: "stun:stun1.l.google.com:19302" },
    // { urls: "turn:your.turn.server", username: "user", credential: "pass" },
  ],
};

/**
 * Connection state constants used by the UI to reflect call status.
 */
export const CONNECTION_STATE = {
  IDLE:         "idle",
  CONNECTING:   "connecting",
  CONNECTED:    "connected",
  DISCONNECTED: "disconnected",
  FAILED:       "failed",
  CLOSED:       "closed",
};


// ── Internal state ────────────────────────────────────────────────────────────

let peerConnection = null;   // RTCPeerConnection instance
let localStream    = null;   // MediaStream from getUserMedia
let remoteStream   = null;   // MediaStream received from remote peer


// ── Core API ─────────────────────────────────────────────────────────────────

/**
 * init()
 * Initialise the WebRTC service with a local media stream and event callbacks.
 *
 * @param {MediaStream}  stream          - Local audio/video stream from getUserMedia
 * @param {Function}     onRemoteStream  - Called with (MediaStream) when remote track arrives
 * @param {Function}     onStateChange   - Called with (CONNECTION_STATE) on state changes
 * @param {Function}     onIceCandidate  - Called with (RTCIceCandidateInit) to send via socket
 * @returns {Promise<void>}
 */
export async function init(stream, onRemoteStream, onStateChange, onIceCandidate) {
  // TODO: Create RTCPeerConnection with ICE_SERVERS
  // TODO: Add local stream tracks to peerConnection
  // TODO: Listen for peerConnection.ontrack → expose remoteStream → call onRemoteStream
  // TODO: Listen for peerConnection.onicecandidate → call onIceCandidate
  // TODO: Listen for peerConnection.onconnectionstatechange → call onStateChange
  console.warn("[webrtcService] init() — not yet implemented");
}

/**
 * createOffer()
 * Creates an SDP offer to initiate the call. Call this on the side that starts.
 *
 * @returns {Promise<RTCSessionDescriptionInit>} The local SDP offer
 */
export async function createOffer() {
  // TODO: peerConnection.createOffer()
  // TODO: peerConnection.setLocalDescription(offer)
  // TODO: return offer
  console.warn("[webrtcService] createOffer() — not yet implemented");
  return null;
}

/**
 * handleOffer()
 * Handles an incoming SDP offer from the remote peer. Call this on the receiver side.
 *
 * @param {RTCSessionDescriptionInit} offer - The SDP offer received via signalling (socket)
 * @returns {Promise<RTCSessionDescriptionInit>} The local SDP answer
 */
export async function handleOffer(offer) {
  // TODO: peerConnection.setRemoteDescription(offer)
  // TODO: peerConnection.createAnswer()
  // TODO: peerConnection.setLocalDescription(answer)
  // TODO: return answer
  console.warn("[webrtcService] handleOffer() — not yet implemented");
  return null;
}

/**
 * setRemoteAnswer()
 * Applies the remote SDP answer after our offer was accepted.
 *
 * @param {RTCSessionDescriptionInit} answer - The SDP answer received via signalling
 * @returns {Promise<void>}
 */
export async function setRemoteAnswer(answer) {
  // TODO: peerConnection.setRemoteDescription(answer)
  console.warn("[webrtcService] setRemoteAnswer() — not yet implemented");
}

/**
 * addIceCandidate()
 * Adds a remote ICE candidate received via the signalling channel.
 *
 * @param {RTCIceCandidateInit} candidate - ICE candidate from the remote peer
 * @returns {Promise<void>}
 */
export async function addIceCandidate(candidate) {
  // TODO: peerConnection.addIceCandidate(new RTCIceCandidate(candidate))
  console.warn("[webrtcService] addIceCandidate() — not yet implemented");
}

/**
 * toggleMic()
 * Enables or disables the local audio track.
 *
 * @param {boolean} enabled
 */
export function toggleMic(enabled) {
  // TODO: localStream.getAudioTracks().forEach(t => t.enabled = enabled)
  console.warn("[webrtcService] toggleMic() — not yet implemented");
}

/**
 * toggleCamera()
 * Enables or disables the local video track.
 *
 * @param {boolean} enabled
 */
export function toggleCamera(enabled) {
  // TODO: localStream.getVideoTracks().forEach(t => t.enabled = enabled)
  console.warn("[webrtcService] toggleCamera() — not yet implemented");
}

/**
 * close()
 * Tears down the peer connection and releases all media tracks.
 */
export function close() {
  // TODO: localStream?.getTracks().forEach(t => t.stop())
  // TODO: peerConnection?.close()
  // TODO: Reset peerConnection, localStream, remoteStream to null
  console.warn("[webrtcService] close() — not yet implemented");
}

/**
 * getLocalStream()
 * @returns {MediaStream|null}
 */
export function getLocalStream() {
  return localStream;
}

/**
 * getRemoteStream()
 * @returns {MediaStream|null}
 */
export function getRemoteStream() {
  return remoteStream;
}

/**
 * getConnectionState()
 * @returns {string} One of CONNECTION_STATE values
 */
export function getConnectionState() {
  if (!peerConnection) return CONNECTION_STATE.IDLE;
  // TODO: map peerConnection.connectionState → CONNECTION_STATE
  return CONNECTION_STATE.IDLE;
}


// ── Default export ────────────────────────────────────────────────────────────
const webrtcService = {
  init,
  createOffer,
  handleOffer,
  setRemoteAnswer,
  addIceCandidate,
  toggleMic,
  toggleCamera,
  close,
  getLocalStream,
  getRemoteStream,
  getConnectionState,
  CONNECTION_STATE,
};

export default webrtcService;