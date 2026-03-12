/**
 * translationService.js
 * ─────────────────────────────────────────────────────────────────────────────
 * SpeakSync — Speech-to-Speech Translation Service (Stub)
 *
 * PURPOSE:
 *   Handles the core translation pipeline: captured audio → LLM API → translated
 *   audio output. This is the bridge between WebRTC audio and the translation
 *   model. This file is a stub — the full pipeline is defined but not implemented.
 *
 * PIPELINE (to be implemented):
 *   1. CAPTURE  — Receive raw audio chunks from the WebRTC audio stream
 *   2. STT      — Convert audio to text (Speech-to-Text: Whisper / Google STT)
 *   3. TRANSLATE — Send source text to the LLM translation API
 *   4. TTS      — Convert translated text back to audio (Text-to-Speech)
 *   5. PLAYBACK — Play or stream translated audio to the remote participant
 *
 * API CONTRACT (expected request/response shape):
 *
 *   POST /api/translate
 *   Headers: { "Content-Type": "application/json" }
 *   Body:    { audioBase64: string, sourceLang: "en" | "ur", targetLang: "en" | "ur" }
 *
 *   Response 200:
 *   {
 *     translatedText:   string,   // translated transcript
 *     translatedAudio:  string,   // base64-encoded audio (MP3 / WAV)
 *     confidence:       number,   // 0–1 confidence score
 *     latencyMs:        number,   // server-side processing time
 *   }
 *
 * LANGUAGE CODES:
 *   "EN → UR"  →  sourceLang: "en", targetLang: "ur"
 *   "UR → EN"  →  sourceLang: "ur", targetLang: "en"
 *
 * USAGE (future):
 *   import translationService from "./translationService";
 *   translationService.init({ direction: "EN → UR", apiUrl: "/api/translate" });
 *   translationService.startListening(localAudioStream);
 *   translationService.onTranslation(({ text, audioBlob }) => playAudio(audioBlob));
 *   translationService.stop();
 * ─────────────────────────────────────────────────────────────────────────────
 */

// ── Constants ─────────────────────────────────────────────────────────────────

export const LANGUAGE_DIRECTION = {
  EN_TO_UR: "EN → UR",
  UR_TO_EN: "UR → EN",
};

/**
 * Maps a UI language direction string to API language codes.
 * @param {string} direction - "EN → UR" | "UR → EN"
 * @returns {{ sourceLang: string, targetLang: string }}
 */
export function parseDirection(direction) {
  if (direction === LANGUAGE_DIRECTION.EN_TO_UR) {
    return { sourceLang: "en", targetLang: "ur" };
  }
  return { sourceLang: "ur", targetLang: "en" };
}

/**
 * Default API endpoint. Override via init() options.
 * This should point to your Node.js/Express backend route.
 */
const DEFAULT_API_URL = "/api/translate";

/**
 * Chunk size in milliseconds for audio capture.
 * Smaller = lower latency but more API calls.
 * Recommended: 1500–3000ms for speech translation.
 */
const AUDIO_CHUNK_MS = 2000;


// ── Internal state ────────────────────────────────────────────────────────────

let config          = null;   // { direction, apiUrl }
let mediaRecorder   = null;   // MediaRecorder instance
let translationCb   = null;   // callback registered via onTranslation()
let isListening     = false;


// ── Core API ─────────────────────────────────────────────────────────────────

/**
 * init()
 * Configures the translation service before use.
 *
 * @param {{ direction: string, apiUrl?: string }} options
 */
export function init(options = {}) {
  config = {
    direction: options.direction ?? LANGUAGE_DIRECTION.EN_TO_UR,
    apiUrl:    options.apiUrl    ?? DEFAULT_API_URL,
  };
  // TODO: Validate options, set up any persistent state
  console.warn("[translationService] init() — configured, pipeline not yet implemented");
}

/**
 * startListening()
 * Begins capturing audio from the local MediaStream and sending chunks to the API.
 *
 * @param {MediaStream} audioStream - Local audio-only stream from getUserMedia
 */
export function startListening(audioStream) {
  if (!config) {
    console.error("[translationService] Call init() before startListening()");
    return;
  }
  if (isListening) return;

  // TODO: Create MediaRecorder with audioStream
  // TODO: On dataavailable event:
  //         1. Convert Blob to base64
  //         2. Call _sendToAPI(base64, config.direction)
  //         3. On API response, call translationCb with { text, audioBlob, confidence }
  // TODO: mediaRecorder.start(AUDIO_CHUNK_MS)  ← timeslice for chunked capture
  // TODO: Set isListening = true

  console.warn("[translationService] startListening() — not yet implemented");
}

/**
 * stop()
 * Stops audio capture and clears state.
 */
export function stop() {
  // TODO: mediaRecorder?.stop()
  // TODO: mediaRecorder = null
  // TODO: isListening = false
  console.warn("[translationService] stop() — not yet implemented");
  isListening = false;
}

/**
 * onTranslation()
 * Registers a callback that fires whenever a translation result is ready.
 *
 * @param {Function} callback
 *   Called with:
 *   {
 *     text:       string,   // translated transcript to display in subtitles
 *     audioBlob:  Blob,     // translated audio to play
 *     confidence: number,   // 0–1
 *     latencyMs:  number,
 *   }
 */
export function onTranslation(callback) {
  translationCb = callback;
}

/**
 * setDirection()
 * Changes the translation direction mid-call (if the user switches language).
 *
 * @param {string} direction - "EN → UR" | "UR → EN"
 */
export function setDirection(direction) {
  if (config) config.direction = direction;
  // TODO: Optionally flush pending audio chunks
  console.warn("[translationService] setDirection() — direction updated, flush not implemented");
}

/**
 * isActive()
 * @returns {boolean}
 */
export function isActive() {
  return isListening;
}


// ── Internal helpers ──────────────────────────────────────────────────────────

/**
 * _sendToAPI()   [private]
 * Sends a base64 audio chunk to the translation backend and returns the result.
 *
 * @param {string} audioBase64  - Base64-encoded audio chunk
 * @param {string} direction    - "EN → UR" | "UR → EN"
 * @returns {Promise<{ translatedText, translatedAudio, confidence, latencyMs }>}
 */
async function _sendToAPI(audioBase64, direction) {
  const { sourceLang, targetLang } = parseDirection(direction);

  // TODO: fetch(config.apiUrl, {
  //   method: "POST",
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify({ audioBase64, sourceLang, targetLang }),
  // })
  // TODO: const data = await response.json()
  // TODO: Convert data.translatedAudio (base64) → Blob → call translationCb
  // TODO: Handle errors and network failures gracefully

  console.warn("[translationService] _sendToAPI() — not yet implemented");
  return null;
}

/**
 * _base64ToBlob()   [private]
 * Converts a base64 audio string to a Blob for Audio playback.
 *
 * @param {string} base64     - Base64 string
 * @param {string} mimeType   - e.g. "audio/mp3"
 * @returns {Blob}
 */
function _base64ToBlob(base64, mimeType = "audio/mp3") {
  // TODO: atob(base64) → Uint8Array → new Blob([...], { type: mimeType })
  console.warn("[translationService] _base64ToBlob() — not yet implemented");
  return null;
}


// ── Default export ────────────────────────────────────────────────────────────
const translationService = {
  init,
  startListening,
  stop,
  onTranslation,
  setDirection,
  isActive,
  parseDirection,
  LANGUAGE_DIRECTION,
};

export default translationService;