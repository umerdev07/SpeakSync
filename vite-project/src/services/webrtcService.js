/**
 * webrtcService.js
 * ─────────────────────────────────────────────────────────────────────────────
 * SpeakSync — WebRTC Service (FULL IMPLEMENTATION)
 *
 * Handles:
 *   - RTCPeerConnection lifecycle
 *   - Local media (mic + cam)
 *   - Screen sharing (replaces video track live on the peer connection)
 *   - ICE candidate trickle exchange
 *   - SDP offer / answer negotiation
 *   - Connection state tracking + ICE restart on failure
 * ─────────────────────────────────────────────────────────────────────────────
 */

// ── ICE / TURN Configuration ──────────────────────────────────────────────────
/**
 * buildIceServers()
 * Merges Google STUN servers with an optional TURN server.
 * TURN is required to pierce symmetric NAT and corporate firewalls.
 * Pass turnConfig from your signalling server's /api/ice-credentials endpoint.
 *
 * @param {{ urls: string, username: string, credential: string }|null} turnConfig
 * @returns {RTCConfiguration}
 */
const buildIceServers = (turnConfig = null) => {
  const servers = [
    { urls: "stun:stun.l.google.com:19302" },
    { urls: "stun:stun1.l.google.com:19302" },
    { urls: "stun:stun2.l.google.com:19302" },
  ];

  if (turnConfig) {
    // Standard TURN over UDP/TCP
    servers.push({
      urls:       turnConfig.urls,
      username:   turnConfig.username,
      credential: turnConfig.credential,
    });
    // TURNS over TLS port 443 — bypasses most deep-packet-inspection firewalls
    const tlsUrl = turnConfig.urls
      .replace(/^turn:/, "turns:")
      .replace(/:\d+$/, ":443");
    servers.push({
      urls:       tlsUrl,
      username:   turnConfig.username,
      credential: turnConfig.credential,
    });
  }

  return {
    iceServers:           servers,
    iceCandidatePoolSize: 10,
    bundlePolicy:         "max-bundle",
    rtcpMuxPolicy:        "require",
  };
};

// ── Connection State Constants ────────────────────────────────────────────────
export const CONNECTION_STATE = {
  IDLE:         "idle",
  CONNECTING:   "connecting",
  CONNECTED:    "connected",
  DISCONNECTED: "disconnected",
  FAILED:       "failed",
  CLOSED:       "closed",
};

// ── Internal State ────────────────────────────────────────────────────────────
let peerConnection  = null;   // RTCPeerConnection
let localStream     = null;   // Camera + mic MediaStream
let screenStream    = null;   // Screen share MediaStream
let remoteStream    = null;   // Remote peer's MediaStream
let isScreenSharing = false;

// Callbacks stored from init()
let _onRemoteStream = null;
let _onStateChange  = null;
let _onIceCandidate = null;

// ─────────────────────────────────────────────────────────────────────────────
// INIT
// ─────────────────────────────────────────────────────────────────────────────

/**
 * init()
 * Initialise (or re-initialise) the peer connection for a new call.
 * Must be called AFTER getUserMedia succeeds.
 *
 * @param {MediaStream}  stream           Local camera+mic stream
 * @param {Function}     onRemoteStream   Called with (MediaStream) when remote tracks arrive
 * @param {Function}     onStateChange    Called with (CONNECTION_STATE) on every state change
 * @param {Function}     onIceCandidate   Called with (RTCIceCandidateInit) — forward via socket
 * @param {object|null}  turnConfig       { urls, username, credential } from your TURN server
 */
export async function init(stream, onRemoteStream, onStateChange, onIceCandidate, turnConfig = null) {
  // Clean up any previous connection
  _destroyPeer();

  localStream     = stream;
  _onRemoteStream = onRemoteStream;
  _onStateChange  = onStateChange;
  _onIceCandidate = onIceCandidate;

  peerConnection = new RTCPeerConnection(buildIceServers(turnConfig));

  // ── Attach local tracks ──
  stream.getTracks().forEach(track => {
    peerConnection.addTrack(track, stream);
  });

  // ── Remote stream assembly ──
  remoteStream = new MediaStream();
  peerConnection.ontrack = (event) => {
    // Add every incoming track to the remote stream
    event.streams[0]?.getTracks().forEach(track => {
      // Avoid duplicate tracks
      if (!remoteStream.getTrackById(track.id)) {
        remoteStream.addTrack(track);
      }
    });
    onRemoteStream(remoteStream);
  };

  // ── ICE candidate trickle ──
  peerConnection.onicecandidate = (event) => {
    if (event.candidate) {
      onIceCandidate(event.candidate.toJSON());
    }
  };

  // ── Connection state ──
  peerConnection.onconnectionstatechange = () => {
    const stateMap = {
      new:          CONNECTION_STATE.CONNECTING,
      connecting:   CONNECTION_STATE.CONNECTING,
      connected:    CONNECTION_STATE.CONNECTED,
      disconnected: CONNECTION_STATE.DISCONNECTED,
      failed:       CONNECTION_STATE.FAILED,
      closed:       CONNECTION_STATE.CLOSED,
    };
    const mapped = stateMap[peerConnection.connectionState] ?? CONNECTION_STATE.IDLE;
    onStateChange(mapped);
  };

  // ── ICE connection state (fallback for older browsers) ──
  peerConnection.oniceconnectionstatechange = () => {
    if (peerConnection.iceConnectionState === "failed") {
      console.warn("[webrtcService] ICE failed — attempting restart…");
      peerConnection.restartIce();
    }
  };

  console.log("[webrtcService] RTCPeerConnection initialised.");
}

// ─────────────────────────────────────────────────────────────────────────────
// OFFER / ANSWER
// ─────────────────────────────────────────────────────────────────────────────

/**
 * createOffer()
 * Called by the INITIATOR (the person who was already in the room).
 * Triggered when the signalling server says a remote peer joined.
 *
 * @returns {Promise<RTCSessionDescriptionInit>}
 */
export async function createOffer() {
  const offer = await peerConnection.createOffer({
    offerToReceiveAudio: true,
    offerToReceiveVideo: true,
  });
  await peerConnection.setLocalDescription(offer);
  console.log("[webrtcService] Offer created.");
  return offer;
}

/**
 * handleOffer()
 * Called by the JOINER when it receives an offer from the initiator.
 *
 * @param {RTCSessionDescriptionInit} offer
 * @returns {Promise<RTCSessionDescriptionInit>} answer — send this back via socket
 */
export async function handleOffer(offer) {
  await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
  const answer = await peerConnection.createAnswer();
  await peerConnection.setLocalDescription(answer);
  console.log("[webrtcService] Offer handled, answer created.");
  return answer;
}

/**
 * setRemoteAnswer()
 * Called by the INITIATOR when it receives the answer.
 *
 * @param {RTCSessionDescriptionInit} answer
 */
export async function setRemoteAnswer(answer) {
  await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
  console.log("[webrtcService] Remote answer set — ICE exchange begins.");
}

/**
 * addIceCandidate()
 * Add a remote ICE candidate received via the socket signalling channel.
 *
 * @param {RTCIceCandidateInit} candidate
 */
export async function addIceCandidate(candidate) {
  if (!peerConnection) return;
  try {
    await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
  } catch (err) {
    // Non-fatal — can happen during renegotiation
    console.warn("[webrtcService] addIceCandidate error (non-fatal):", err.message);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// MEDIA CONTROLS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * toggleMic()
 * @param {boolean} enabled
 */
export function toggleMic(enabled) {
  localStream?.getAudioTracks().forEach(t => (t.enabled = enabled));
}

/**
 * toggleCamera()
 * No-op when screen sharing is active (don't overwrite the screen track).
 * @param {boolean} enabled
 */
export function toggleCamera(enabled) {
  if (isScreenSharing) return;
  localStream?.getVideoTracks().forEach(t => (t.enabled = enabled));
}

// ─────────────────────────────────────────────────────────────────────────────
// SCREEN SHARING
// ─────────────────────────────────────────────────────────────────────────────

/**
 * startScreenShare()
 * Calls getDisplayMedia, then replaces the outgoing video track
 * on the RTCPeerConnection with the screen track (live, no renegotiation needed).
 *
 * @param {Function} onScreenStreamReady  (MediaStream) => void  for local preview
 * @param {Function} onScreenShareEnded   () => void             browser "Stop sharing" btn
 * @returns {Promise<MediaStream>}
 */
export async function startScreenShare(onScreenStreamReady, onScreenShareEnded) {
  if (isScreenSharing) return screenStream;

  screenStream = await navigator.mediaDevices.getDisplayMedia({
    video: {
      displaySurface: "monitor",
      cursor:         "always",
      frameRate:      { ideal: 30 },
    },
    audio: {
      // System audio — supported in Chrome/Edge only
      echoCancellation: false,
      noiseSuppression: false,
    },
  });

  const screenVideoTrack = screenStream.getVideoTracks()[0];

  // Replace the video sender track live — no full renegotiation required
  if (peerConnection) {
    const videoSender = peerConnection
      .getSenders()
      .find(s => s.track?.kind === "video");
    if (videoSender) {
      await videoSender.replaceTrack(screenVideoTrack);
    }
  }

  isScreenSharing = true;
  onScreenStreamReady?.(screenStream);

  // Handle browser's native "Stop sharing" button
  screenVideoTrack.onended = async () => {
    await stopScreenShare();
    onScreenShareEnded?.();
  };

  console.log("[webrtcService] Screen share started.");
  return screenStream;
}

/**
 * stopScreenShare()
 * Stops the screen stream and restores the camera track.
 */
export async function stopScreenShare() {
  if (!isScreenSharing) return;

  screenStream?.getTracks().forEach(t => t.stop());
  screenStream    = null;
  isScreenSharing = false;

  // Restore camera video track to the peer connection
  const camTrack = localStream?.getVideoTracks()[0];
  if (camTrack && peerConnection) {
    const videoSender = peerConnection
      .getSenders()
      .find(s => s.track?.kind === "video");
    if (videoSender) {
      await videoSender.replaceTrack(camTrack);
    }
  }

  console.log("[webrtcService] Screen share stopped. Camera restored.");
}

export function getIsScreenSharing() {
  return isScreenSharing;
}

// ─────────────────────────────────────────────────────────────────────────────
// CLEANUP
// ─────────────────────────────────────────────────────────────────────────────

function _destroyPeer() {
  screenStream?.getTracks().forEach(t => t.stop());
  peerConnection?.close();
  peerConnection  = null;
  remoteStream    = null;
  screenStream    = null;
  isScreenSharing = false;
}

/**
 * close()
 * Full teardown — call on hang up.
 */
export function close() {
  _destroyPeer();
  localStream?.getTracks().forEach(t => t.stop());
  localStream = null;
  console.log("[webrtcService] Peer connection closed.");
}

// ─────────────────────────────────────────────────────────────────────────────
// GETTERS
// ─────────────────────────────────────────────────────────────────────────────
export function getLocalStream()     { return localStream; }
export function getRemoteStream()    { return remoteStream; }
export function getScreenStream()    { return screenStream; }
export function getConnectionState() {
  if (!peerConnection) return CONNECTION_STATE.IDLE;
  const map = {
    new:          CONNECTION_STATE.CONNECTING,
    connecting:   CONNECTION_STATE.CONNECTING,
    connected:    CONNECTION_STATE.CONNECTED,
    disconnected: CONNECTION_STATE.DISCONNECTED,
    failed:       CONNECTION_STATE.FAILED,
    closed:       CONNECTION_STATE.CLOSED,
  };
  return map[peerConnection.connectionState] ?? CONNECTION_STATE.IDLE;
}

const webrtcService = {
  init,
  createOffer, handleOffer, setRemoteAnswer, addIceCandidate,
  toggleMic, toggleCamera,
  startScreenShare, stopScreenShare, getIsScreenSharing,
  close,
  getLocalStream, getRemoteStream, getScreenStream, getConnectionState,
  CONNECTION_STATE,
};
export default webrtcService;