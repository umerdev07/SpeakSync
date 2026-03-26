/**
 * translationService.js
 * ─────────────────────────────────────────────────────────────────────────────
 * SpeakSync — Speech-to-Speech Translation Service
 *
 * STATUS: Pipeline stub — connect your NLLB / m2m100 model at the marked hooks.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * WHERE TO USE THIS SERVICE IN MeetingRoom.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 *
 *  All four hooks are already marked in MeetingRoom.jsx with the comment:
 *  // 🌐 TRANSLATION_HOOK #N
 *
 *  HOOK #1 — Start translation when the call connects (in the useEffect):
 *  ─────────────────────────────────────────────────────────────────────
 *    import translationService from "../services/translationService";
 *
 *    // After getUserMedia succeeds and socket connects:
 *    translationService.init({ direction: langDir, apiUrl: "/api/translate" });
 *    translationService.startListening(stream);       // pass local audio stream
 *    translationService.onTranslation(({ text, audioBlob }) => {
 *      setSubtitleText(text);                         // show in subtitle bar
 *      const audio = new Audio(URL.createObjectURL(audioBlob));
 *      audio.play();                                  // play translated audio
 *    });
 *
 *  HOOK #2 — Stop translation on unmount / hang up:
 *  ─────────────────────────────────────────────────
 *    // Inside the useEffect cleanup return:
 *    translationService.stop();
 *
 *  HOOK #3 — Update direction mid-call when user toggles language:
 *  ───────────────────────────────────────────────────────────────
 *    // Inside handleToggleLang():
 *    translationService.setDirection(next);
 *
 *  HOOK #4 — Subtitle display:
 *  ────────────────────────────
 *    // Add this state to MeetingRoom:
 *    const [subtitleText, setSubtitleText] = useState("");
 *
 *    // In the subtitle bar JSX, replace the static string with:
 *    {subtitleText || "🎙 Listening for speech…"}
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * BACKEND API CONTRACT  (your NLLB / m2m100 endpoint)
 * ─────────────────────────────────────────────────────────────────────────────
 *
 *  POST /api/translate
 *  Content-Type: application/json
 *
 *  Request body:
 *  {
 *    audioBase64: string,        // base64-encoded WAV/WebM chunk
 *    sourceLang:  "en" | "ur",   // "EN → UR" maps to sourceLang: "en"
 *    targetLang:  "en" | "ur",
 *  }
 *
 *  Response 200:
 *  {
 *    translatedText:  string,   // translated transcript → show as subtitle
 *    translatedAudio: string,   // base64 MP3/WAV → play on remote side
 *    confidence:      number,   // 0–1 (optional)
 *    latencyMs:       number,   // optional, for debugging
 *  }
 *
 *  Pipeline inside your model server:
 *    1. Decode base64 audio → bytes
 *    2. Whisper (or any STT) → transcript in source language
 *    3. NLLB-200 / m2m100   → translated text in target language
 *    4. TTS (e.g. Coqui, Bark, gTTS) → audio bytes
 *    5. Return translatedText + base64(audio bytes)
 *
 * ─────────────────────────────────────────────────────────────────────────────
 */

// ── Language helpers ──────────────────────────────────────────────────────────
export const LANGUAGE_DIRECTION = {
  EN_TO_UR: "EN → UR",
  UR_TO_EN: "UR → EN",
};

/**
 * parseDirection()
 * Maps the UI direction badge to API language codes.
 *
 * @param {string} direction  "EN → UR" | "UR → EN"
 * @returns {{ sourceLang: string, targetLang: string }}
 */
export function parseDirection(direction) {
  return direction === LANGUAGE_DIRECTION.EN_TO_UR
    ? { sourceLang: "en", targetLang: "ur" }
    : { sourceLang: "ur", targetLang: "en" };
}

// ── Config ────────────────────────────────────────────────────────────────────
const DEFAULT_API_URL  = "/api/translate";
const AUDIO_CHUNK_MS   = 2000;   // send 2-second audio chunks to API

// ── Internal state ────────────────────────────────────────────────────────────
let config         = null;
let mediaRecorder  = null;
let translationCb  = null;
let isListening    = false;

// ── Core API ──────────────────────────────────────────────────────────────────

/**
 * init()
 * Must be called before startListening().
 *
 * @param {{ direction: string, apiUrl?: string }} options
 */
export function init(options = {}) {
  config = {
    direction: options.direction ?? LANGUAGE_DIRECTION.EN_TO_UR,
    apiUrl:    options.apiUrl    ?? DEFAULT_API_URL,
  };
  console.log("[translationService] Initialised:", config);
}

/**
 * startListening()
 * Begins capturing audio in chunks and sending each chunk to the translation API.
 *
 * @param {MediaStream} audioStream  Local audio stream from getUserMedia
 */
export function startListening(audioStream) {
  if (!config) {
    console.error("[translationService] Call init() first.");
    return;
  }
  if (isListening) return;

  // Extract audio-only stream to avoid sending video to the API
  const audioOnly = new MediaStream(audioStream.getAudioTracks());

  // Choose best supported MIME type
  const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
    ? "audio/webm;codecs=opus"
    : MediaRecorder.isTypeSupported("audio/webm")
      ? "audio/webm"
      : "audio/ogg";

  mediaRecorder = new MediaRecorder(audioOnly, { mimeType });

  mediaRecorder.ondataavailable = async (event) => {
    if (!event.data || event.data.size === 0) return;
    const base64 = await _blobToBase64(event.data);
    const result = await _sendToAPI(base64, config.direction);
    if (result && translationCb) {
      translationCb(result);
    }
  };

  mediaRecorder.start(AUDIO_CHUNK_MS);
  isListening = true;
  console.log("[translationService] Listening started.");
}

/**
 * stop()
 * Stops audio capture.
 */
export function stop() {
  mediaRecorder?.stop();
  mediaRecorder = null;
  isListening   = false;
  console.log("[translationService] Stopped.");
}

/**
 * onTranslation()
 * Register the callback that receives translation results.
 *
 * @param {Function} callback
 *   Called with:
 *   {
 *     text:       string,   // translated transcript (show as subtitle)
 *     audioBlob:  Blob,     // translated audio (play on remote side)
 *     confidence: number,
 *     latencyMs:  number,
 *   }
 */
export function onTranslation(callback) {
  translationCb = callback;
}

/**
 * setDirection()
 * Change translation direction mid-call.
 *
 * @param {string} direction  "EN → UR" | "UR → EN"
 */
export function setDirection(direction) {
  if (config) {
    config.direction = direction;
    console.log("[translationService] Direction updated:", direction);
  }
}

export function isActive() { return isListening; }

// ── Private helpers ───────────────────────────────────────────────────────────

/**
 * _sendToAPI()
 * Posts a base64 audio chunk to your model endpoint and returns the result.
 */
async function _sendToAPI(audioBase64, direction) {
  const { sourceLang, targetLang } = parseDirection(direction);
  try {
    const response = await fetch(config.apiUrl, {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ audioBase64, sourceLang, targetLang }),
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    return {
      text:       data.translatedText,
      audioBlob:  _base64ToBlob(data.translatedAudio, "audio/mp3"),
      confidence: data.confidence ?? 1,
      latencyMs:  data.latencyMs  ?? 0,
    };
  } catch (err) {
    console.error("[translationService] API error:", err.message);
    return null;
  }
}

/** Convert a Blob to base64 string */
function _blobToBase64(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result.split(",")[1]);
    reader.onerror   = reject;
    reader.readAsDataURL(blob);
  });
}

/** Convert a base64 string to a Blob for Audio playback */
function _base64ToBlob(base64, mimeType = "audio/mp3") {
  try {
    const bytes  = atob(base64);
    const arr    = new Uint8Array(bytes.length);
    for (let i = 0; i < bytes.length; i++) arr[i] = bytes.charCodeAt(i);
    return new Blob([arr], { type: mimeType });
  } catch (err) {
    console.error("[translationService] _base64ToBlob error:", err);
    return null;
  }
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