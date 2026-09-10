/**
 * Utility for managing user's custom Gemini API Keys in localStorage with
 * Multi-Key Failover Pool & Auto-Rotation support.
 * Ensures API Keys are stored safely on the client and sent securely to the server proxy.
 */

export type ApiKeyStatus = "active" | "standby" | "exhausted" | "invalid";

export interface StoredApiKey {
  id: string;
  key: string;
  label: string;
  status: ApiKeyStatus;
  addedAt: number;
  lastUsedAt?: number;
  exhaustedAt?: number;
  cooldownUntil?: number;
  failureCount?: number;
  requestCountInWindow?: number;
  windowStartAt?: number;
  totalRequests?: number;
}

export interface KeyRotationResult {
  success: boolean;
  previousKeyId?: string;
  nextKey: string | null;
  nextKeyId?: string;
  nextKeyLabel?: string;
  message: string;
  isPreemptive?: boolean;
}

// Storage keys
const STORAGE_POOL_KEY = "cherry_ai_gemini_api_keys_pool";
const LEGACY_STORAGE_KEY = "cherry_ai_custom_gemini_api_key";
const VALIDATION_STATUS_KEY = "cherry_ai_custom_key_validated";

// Rate-limit cooldown: 60 seconds (Gemini Free Tier 15 RPM window resets every 60s)
export const DEFAULT_COOLDOWN_MS = 60 * 1000;

// Pre-emptive handover threshold:
// Gemini Free Tier allows 15 RPM. If 10 requests are consumed within a 60-second rolling window,
// and another standby backup key is ready, perform a silent pre-emptive handover before 429 ever fires!
export const PREEMPTIVE_REQUEST_THRESHOLD = 10;
export const RATE_LIMIT_WINDOW_MS = 60 * 1000;

/**
 * Mask an API key for safe display (e.g., AIzaSyD...9k1Q)
 */
export function maskApiKey(key: string): string {
  if (!key) return "";
  const trimmed = key.trim();
  if (trimmed.length <= 10) return "••••••••";
  return `${trimmed.slice(0, 7)}...${trimmed.slice(-4)}`;
}

/**
 * Dispatches browser events so any active session/modal can react in real-time
 */
function dispatchKeysUpdated(keys: StoredApiKey[]): void {
  if (typeof window !== "undefined") {
    try {
      window.dispatchEvent(
        new CustomEvent("gemini-keys-updated", {
          detail: { keys, activeKey: getActiveApiKey() },
        })
      );
    } catch {
      // Ignore in non-browser environments
    }
  }
}

function dispatchKeyRotated(result: KeyRotationResult): void {
  if (typeof window !== "undefined") {
    try {
      window.dispatchEvent(
        new CustomEvent("gemini-key-rotated", {
          detail: result,
        })
      );
    } catch {
      // Ignore in non-browser environments
    }
  }
}

/**
 * Internal helper to migrate legacy single-key storage into the new pool
 */
function migrateLegacyStorage(): StoredApiKey[] {
  if (typeof window === "undefined") return [];
  try {
    const rawLegacy = (localStorage.getItem(LEGACY_STORAGE_KEY) || "").trim();
    if (rawLegacy && rawLegacy.length > 10) {
      const migratedKey: StoredApiKey = {
        id: `key_${Date.now()}_primary`,
        key: rawLegacy,
        label: "Primary Key",
        status: "active",
        addedAt: Date.now(),
        lastUsedAt: Date.now(),
      };
      const initialPool = [migratedKey];
      localStorage.setItem(STORAGE_POOL_KEY, JSON.stringify(initialPool));
      return initialPool;
    }
  } catch (e) {
    console.error("Failed to migrate legacy Gemini API key:", e);
  }
  return [];
}

/**
 * Retrieve all configured API keys from the pool.
 * Automatically checks and resets cooldowns for expired 'exhausted' keys.
 */
export function getAllStoredApiKeys(): StoredApiKey[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = localStorage.getItem(STORAGE_POOL_KEY);
    let pool: StoredApiKey[] = raw ? JSON.parse(raw) : [];

    // Fallback/migration if pool is empty but legacy key exists
    if (pool.length === 0) {
      pool = migrateLegacyStorage();
    }

    if (!Array.isArray(pool) || pool.length === 0) {
      return [];
    }

    const now = Date.now();
    let mutated = false;

    // Check cooldowns: if cooldown period has passed, restore 'exhausted' keys to 'standby'
    pool = pool.map((item) => {
      if (item.status === "exhausted" && item.cooldownUntil && now >= item.cooldownUntil) {
        mutated = true;
        return {
          ...item,
          status: "standby" as ApiKeyStatus,
          cooldownUntil: undefined,
          exhaustedAt: undefined,
          requestCountInWindow: 0,
          windowStartAt: now,
        };
      }

      // Reset request counting window if 60s passed
      if (item.windowStartAt && now - item.windowStartAt >= RATE_LIMIT_WINDOW_MS) {
        if ((item.requestCountInWindow || 0) > 0) {
          mutated = true;
          return {
            ...item,
            requestCountInWindow: 0,
            windowStartAt: now,
          };
        }
      }

      return item;
    });

    // Ensure there is at least one active key if valid keys exist
    const hasActive = pool.some((k) => k.status === "active");
    if (!hasActive) {
      const firstStandbyIdx = pool.findIndex((k) => k.status === "standby");
      if (firstStandbyIdx !== -1) {
        pool[firstStandbyIdx].status = "active";
        mutated = true;
      }
    }

    if (mutated) {
      saveStoredApiKeys(pool);
    }

    return pool;
  } catch (e) {
    console.error("Failed to load Gemini API keys pool:", e);
    return [];
  }
}

/**
 * Persists the entire API keys pool and keeps legacy single-key storage in sync
 */
export function saveStoredApiKeys(keys: StoredApiKey[]): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(STORAGE_POOL_KEY, JSON.stringify(keys));

    // Keep legacy storage in sync with current active key
    const activeItem = keys.find((k) => k.status === "active");
    if (activeItem && activeItem.key) {
      localStorage.setItem(LEGACY_STORAGE_KEY, activeItem.key.trim());
    } else {
      // If no active key, remove legacy storage
      localStorage.removeItem(LEGACY_STORAGE_KEY);
    }

    dispatchKeysUpdated(keys);
  } catch (e) {
    console.error("Failed to save Gemini API keys pool:", e);
  }
}

/**
 * Get the currently active API Key string (or empty if none active)
 */
export function getActiveApiKey(): string {
  const pool = getAllStoredApiKeys();
  const active = pool.find((k) => k.status === "active");
  if (active && active.key) {
    return active.key.trim();
  }

  // If no active key, try first standby
  const standby = pool.find((k) => k.status === "standby");
  if (standby && standby.key) {
    setActiveApiKey(standby.id);
    return standby.key.trim();
  }

  // Fallback to legacy storage if available
  if (typeof window !== "undefined") {
    try {
      return (localStorage.getItem(LEGACY_STORAGE_KEY) || "").trim();
    } catch {
      return "";
    }
  }

  return "";
}

/**
 * Get the full active StoredApiKey object
 */
export function getActiveStoredKey(): StoredApiKey | null {
  const pool = getAllStoredApiKeys();
  return pool.find((k) => k.status === "active") || null;
}

/**
 * Backward compatibility alias for existing app code
 */
export const getCustomGeminiApiKey = getActiveApiKey;
export const getStoredGeminiApiKey = getActiveApiKey;

/**
 * Add a new API Key into the pool.
 * Automatically assigns a label (e.g. "Primary Key" or "Backup Key N")
 */
export function addStoredApiKey(key: string, customLabel?: string): StoredApiKey {
  const cleanKey = key.trim();
  if (!cleanKey) {
    throw new Error("API Key cannot be empty");
  }

  const pool = getAllStoredApiKeys();

  // Check if key already exists
  const existing = pool.find((k) => k.key.trim() === cleanKey);
  if (existing) {
    // If it exists, activate it or return it
    if (customLabel) {
      existing.label = customLabel.trim();
      saveStoredApiKeys(pool);
    }
    return existing;
  }

  const isFirstKey = pool.length === 0;
  const newKeyItem: StoredApiKey = {
    id: `key_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    key: cleanKey,
    label:
      customLabel?.trim() ||
      (isFirstKey ? "Primary Key" : `Backup Key ${pool.length}`),
    status: isFirstKey ? "active" : "standby",
    addedAt: Date.now(),
    lastUsedAt: Date.now(),
  };

  const updatedPool = [...pool, newKeyItem];
  saveStoredApiKeys(updatedPool);
  return newKeyItem;
}

/**
 * Sets a single custom API key (backward compatible helper)
 */
export function setCustomGeminiApiKey(key: string): void {
  const trimmed = key.trim();
  if (!trimmed) {
    removeCustomGeminiApiKey();
    return;
  }

  const pool = getAllStoredApiKeys();
  if (pool.length === 0) {
    addStoredApiKey(trimmed, "Primary Key");
  } else {
    // Check if key exists
    const idx = pool.findIndex((k) => k.key.trim() === trimmed);
    if (idx !== -1) {
      setActiveApiKey(pool[idx].id);
    } else {
      // Replace the primary/active key or add new
      const activeIdx = pool.findIndex((k) => k.status === "active");
      if (activeIdx !== -1) {
        pool[activeIdx].key = trimmed;
        pool[activeIdx].lastUsedAt = Date.now();
        saveStoredApiKeys(pool);
      } else {
        addStoredApiKey(trimmed);
      }
    }
  }
}

/**
 * Removes a key from the pool by ID or Key string
 */
export function removeStoredApiKey(idOrKey: string): void {
  const pool = getAllStoredApiKeys();
  const target = pool.find((k) => k.id === idOrKey || k.key.trim() === idOrKey.trim());
  if (!target) return;

  const wasActive = target.status === "active";
  const updatedPool = pool.filter((k) => k.id !== target.id);

  if (wasActive && updatedPool.length > 0) {
    // Promote first standby key to active
    const nextStandby = updatedPool.find((k) => k.status === "standby") || updatedPool[0];
    if (nextStandby) {
      nextStandby.status = "active";
    }
  }

  saveStoredApiKeys(updatedPool);
}

/**
 * Remove all custom API keys (clears entire pool)
 */
export function removeCustomGeminiApiKey(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(STORAGE_POOL_KEY);
    localStorage.removeItem(LEGACY_STORAGE_KEY);
    localStorage.removeItem(VALIDATION_STATUS_KEY);
    dispatchKeysUpdated([]);
  } catch (e) {
    console.error("Failed to remove custom Gemini API keys:", e);
  }
}

export const clearAllStoredApiKeys = removeCustomGeminiApiKey;

/**
 * Set a specific key as active by ID or Key string
 */
export function setActiveApiKey(idOrKey: string): boolean {
  const pool = getAllStoredApiKeys();
  const targetIndex = pool.findIndex(
    (k) => k.id === idOrKey || k.key.trim() === idOrKey.trim()
  );

  if (targetIndex === -1) return false;

  const updatedPool = pool.map((k, idx) => ({
    ...k,
    status: (idx === targetIndex ? "active" : k.status === "active" ? "standby" : k.status) as ApiKeyStatus,
    lastUsedAt: idx === targetIndex ? Date.now() : k.lastUsedAt,
  }));

  saveStoredApiKeys(updatedPool);
  return true;
}

/**
 * Marks a key as exhausted (429 or quota limit reached) and auto-rotates to the next standby key
 */
export function markKeyExhausted(
  keyOrId?: string,
  cooldownMs: number = DEFAULT_COOLDOWN_MS
): KeyRotationResult {
  const pool = getAllStoredApiKeys();
  if (pool.length === 0) {
    return {
      success: false,
      nextKey: null,
      message: "No Gemini API keys configured.",
    };
  }

  // Find target key (specified or currently active)
  let targetIndex = -1;
  if (keyOrId) {
    targetIndex = pool.findIndex(
      (k) => k.id === keyOrId || k.key.trim() === keyOrId.trim()
    );
  }
  if (targetIndex === -1) {
    targetIndex = pool.findIndex((k) => k.status === "active");
  }
  if (targetIndex === -1) {
    targetIndex = 0;
  }

  const exhaustedKey = pool[targetIndex];
  const previousKeyId = exhaustedKey.id;

  // Update exhausted key status & cooldown
  exhaustedKey.status = "exhausted";
  exhaustedKey.exhaustedAt = Date.now();
  exhaustedKey.cooldownUntil = Date.now() + cooldownMs;
  exhaustedKey.failureCount = (exhaustedKey.failureCount || 0) + 1;

  // Search for the next available standby key
  const nextStandby = pool.find((k) => k.id !== exhaustedKey.id && k.status === "standby");

  if (nextStandby) {
    nextStandby.status = "active";
    nextStandby.lastUsedAt = Date.now();
    saveStoredApiKeys(pool);

    const result: KeyRotationResult = {
      success: true,
      previousKeyId,
      nextKey: nextStandby.key.trim(),
      nextKeyId: nextStandby.id,
      nextKeyLabel: nextStandby.label,
      message: `Switched from "${exhaustedKey.label}" to "${nextStandby.label}".`,
    };

    dispatchKeyRotated(result);
    return result;
  }

  // If no standby keys available, check if any exhausted key has an earlier cooldown
  saveStoredApiKeys(pool);

  const result: KeyRotationResult = {
    success: false,
    previousKeyId,
    nextKey: null,
    message: "All configured API keys have exceeded their current quota limit.",
  };

  dispatchKeyRotated(result);
  return result;
}

/**
 * Manually or programmatically rotates to the next available backup key
 */
export function rotateToNextApiKey(): KeyRotationResult {
  const pool = getAllStoredApiKeys();
  if (pool.length <= 1) {
    return {
      success: false,
      nextKey: pool[0]?.key || null,
      message: "No backup keys available to rotate.",
    };
  }

  const activeIndex = pool.findIndex((k) => k.status === "active");
  const nextIndex = (activeIndex + 1) % pool.length;

  const prevKey = pool[activeIndex];
  const nextKey = pool[nextIndex];

  if (prevKey) prevKey.status = "standby";
  nextKey.status = "active";
  nextKey.lastUsedAt = Date.now();

  saveStoredApiKeys(pool);

  const result: KeyRotationResult = {
    success: true,
    previousKeyId: prevKey?.id,
    nextKey: nextKey.key.trim(),
    nextKeyId: nextKey.id,
    nextKeyLabel: nextKey.label,
    message: `Active key rotated to "${nextKey.label}".`,
  };

  dispatchKeyRotated(result);
  return result;
}

/**
 * Reset a key's status back to standby or active (e.g., after user re-checks or clears cooldown)
 */
export function resetKeyStatus(idOrKey: string, newStatus: ApiKeyStatus = "standby"): void {
  const pool = getAllStoredApiKeys();
  const target = pool.find((k) => k.id === idOrKey || k.key.trim() === idOrKey.trim());
  if (!target) return;

  target.status = newStatus;
  target.exhaustedAt = undefined;
  target.cooldownUntil = undefined;
  target.failureCount = 0;

  saveStoredApiKeys(pool);
}

/**
 * Check if at least one valid custom API key is configured
 */
export function isCustomApiKeyConfigured(): boolean {
  const key = getActiveApiKey();
  return Boolean(key && key.length > 10);
}

export const hasCustomGeminiApiKey = isCustomApiKeyConfigured;

/**
 * Validates a Gemini API Key via our backend validation endpoint
 */
export async function validateGeminiApiKey(
  apiKey: string
): Promise<{ valid: boolean; message: string; model?: string }> {
  const cleanKey = apiKey.trim();
  if (!cleanKey) {
    return { valid: false, message: "Please enter an API Key." };
  }

  if (cleanKey.length < 20) {
    return {
      valid: false,
      message: "API Key seems too short. Please verify from Google AI Studio.",
    };
  }

  try {
    const res = await fetch("/api/validate-gemini-key", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-gemini-api-key": cleanKey,
      },
      body: JSON.stringify({ apiKey: cleanKey }),
    });

    const data = await res.json();
    if (res.ok && data.valid) {
      return {
        valid: true,
        message: data.message || "API Key verified successfully! 🎉",
        model: data.model,
      };
    } else {
      return {
        valid: false,
        message:
          data.error ||
          data.message ||
          "Invalid API key. Please check again.",
      };
    }
  } catch {
    return {
      valid: false,
      message: "Network error while checking API key. Please retry.",
    };
  }
}

/**
 * Helper to get standard headers with the user's currently active custom API key (if set)
 */
export function getApiHeaders(
  additionalHeaders: Record<string, string> = {}
): Record<string, string> {
  const key = getActiveApiKey();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...additionalHeaders,
  };
  if (key) {
    headers["x-gemini-api-key"] = key;
  }
  return headers;
}

/**
 * Records an outgoing API request against the active API key (or specified key).
 * If the key reaches the pre-emptive threshold (e.g., 10 requests in 60s) AND
 * another standby backup key is ready, this performs a silent PRE-EMPTIVE HANDOVER
 * before Google's 429 quota error can ever trigger!
 */
export function recordKeyRequestAndCheckHandover(keyOrId?: string): {
  handedOver: boolean;
  activeKey: string;
  activeLabel?: string;
  requestsInWindow: number;
} {
  const pool = getAllStoredApiKeys();
  if (pool.length === 0) {
    return { handedOver: false, activeKey: "", requestsInWindow: 0 };
  }

  const now = Date.now();
  let targetIdx = -1;

  if (keyOrId) {
    targetIdx = pool.findIndex(
      (k) => k.id === keyOrId || k.key.trim() === keyOrId.trim()
    );
  }
  if (targetIdx === -1) {
    targetIdx = pool.findIndex((k) => k.status === "active");
  }
  if (targetIdx === -1) {
    targetIdx = 0;
  }

  const currentKey = pool[targetIdx];
  const windowStart = currentKey.windowStartAt || 0;

  // Reset window if 60 seconds have elapsed
  if (now - windowStart >= RATE_LIMIT_WINDOW_MS) {
    currentKey.windowStartAt = now;
    currentKey.requestCountInWindow = 1;
  } else {
    currentKey.requestCountInWindow = (currentKey.requestCountInWindow || 0) + 1;
  }

  currentKey.totalRequests = (currentKey.totalRequests || 0) + 1;
  currentKey.lastUsedAt = now;

  const count = currentKey.requestCountInWindow;

  // Check pre-emptive handover condition:
  // If request count has reached the safety limit (10 / 15 RPM)
  if (count >= PREEMPTIVE_REQUEST_THRESHOLD) {
    const nextStandby = pool.find(
      (k) => k.id !== currentKey.id && k.status === "standby"
    );

    if (nextStandby) {
      console.log(
        `[Predictive Handover] Key "${currentKey.label}" reached safe budget (${count}/${PREEMPTIVE_REQUEST_THRESHOLD}). Pre-emptively switching to "${nextStandby.label}" to avoid 429 quota hit!`
      );

      // Place current key in a short 60s cooldown to reset its free tier RPM
      currentKey.status = "exhausted";
      currentKey.exhaustedAt = now;
      currentKey.cooldownUntil = now + DEFAULT_COOLDOWN_MS;

      // Promote standby key to active
      nextStandby.status = "active";
      nextStandby.windowStartAt = now;
      nextStandby.requestCountInWindow = 0;
      nextStandby.lastUsedAt = now;

      saveStoredApiKeys(pool);

      const result: KeyRotationResult = {
        success: true,
        previousKeyId: currentKey.id,
        nextKey: nextStandby.key.trim(),
        nextKeyId: nextStandby.id,
        nextKeyLabel: nextStandby.label,
        message: `⚡ Pre-emptive Handover: Soft-switched from "${currentKey.label}" to "${nextStandby.label}" to prevent quota interruption.`,
        isPreemptive: true,
      };

      dispatchKeyRotated(result);

      return {
        handedOver: true,
        activeKey: nextStandby.key.trim(),
        activeLabel: nextStandby.label,
        requestsInWindow: 0,
      };
    }
  }

  saveStoredApiKeys(pool);

  return {
    handedOver: false,
    activeKey: currentKey.key.trim(),
    activeLabel: currentKey.label,
    requestsInWindow: count,
  };
}

/**
 * Global background recovery ticker.
 * Runs every 1 second in browser environments to automatically restore
 * keys that have finished their 60-second cooldown back to 'standby' status.
 */
let recoveryTickerStarted = false;

export function initCooldownRecoveryTicker(): void {
  if (typeof window === "undefined" || recoveryTickerStarted) return;
  recoveryTickerStarted = true;

  setInterval(() => {
    try {
      const raw = localStorage.getItem(STORAGE_POOL_KEY);
      if (!raw) return;

      const pool: StoredApiKey[] = JSON.parse(raw);
      if (!Array.isArray(pool) || pool.length === 0) return;

      const now = Date.now();
      let mutated = false;
      const recoveredLabels: string[] = [];

      const updatedPool = pool.map((item) => {
        // Cooldown elapsed: restore from exhausted to standby
        if (
          item.status === "exhausted" &&
          item.cooldownUntil &&
          now >= item.cooldownUntil
        ) {
          mutated = true;
          recoveredLabels.push(item.label);
          return {
            ...item,
            status: "standby" as ApiKeyStatus,
            cooldownUntil: undefined,
            exhaustedAt: undefined,
            requestCountInWindow: 0,
            windowStartAt: now,
          };
        }

        // Window elapsed for active key: reset rolling counter
        if (
          item.windowStartAt &&
          now - item.windowStartAt >= RATE_LIMIT_WINDOW_MS &&
          (item.requestCountInWindow || 0) > 0
        ) {
          item.requestCountInWindow = 0;
          item.windowStartAt = now;
          mutated = true;
        }

        return item;
      });

      // If no active key exists, promote the first standby/recovered key
      const hasActive = updatedPool.some((k) => k.status === "active");
      if (!hasActive) {
        const firstStandby = updatedPool.find((k) => k.status === "standby");
        if (firstStandby) {
          firstStandby.status = "active";
          mutated = true;
        }
      }

      if (mutated) {
        saveStoredApiKeys(updatedPool);
        if (recoveredLabels.length > 0) {
          window.dispatchEvent(
            new CustomEvent("gemini-key-recovered", {
              detail: { recoveredLabels },
            })
          );
        }
      }
    } catch {
      // Safe catch for storage operations
    }
  }, 1000);
}

// Auto-initialize background ticker in browser
if (typeof window !== "undefined") {
  initCooldownRecoveryTicker();
}

/**
 * Smart fetch wrapper that combines:
 * 1. Predictive Pre-emptive Handover: Switches to standby key BEFORE 429 occurs.
 * 2. Reactive Failover: If 429 still occurs, rotates to next standby key and retries seamlessly.
 */
export async function fetchWithKeyFailover(
  input: RequestInfo | URL,
  init?: RequestInit,
  maxKeyRetries = 3
): Promise<Response> {
  // Proactive check: record request and check if pre-emptive handover is needed
  const handover = recordKeyRequestAndCheckHandover();
  if (handover.handedOver) {
    console.log(
      `[fetchWithKeyFailover] Pre-emptively rotated to key: ${handover.activeLabel}`
    );
  }

  let attempts = 0;

  while (attempts < maxKeyRetries) {
    attempts++;
    const currentKey = getActiveApiKey();

    // Prepare headers
    const customHeaders: Record<string, string> = {};
    if (init && init.headers) {
      if (init.headers instanceof Headers) {
        init.headers.forEach((val, key) => {
          customHeaders[key] = val;
        });
      } else if (Array.isArray(init.headers)) {
        init.headers.forEach(([k, v]) => {
          customHeaders[k] = v;
        });
      } else {
        Object.assign(customHeaders, init.headers);
      }
    }

    // Attach active key if not manually provided
    if (currentKey && !customHeaders["x-gemini-api-key"] && !customHeaders["x-api-key"]) {
      customHeaders["x-gemini-api-key"] = currentKey;
    }

    try {
      const response = await fetch(input, {
        ...init,
        headers: customHeaders,
      });

      // If status 429 (Too Many Requests / Quota Exceeded)
      if (response.status === 429) {
        console.warn(`[Key Failover] HTTP 429 received. Rotating to backup key (Attempt ${attempts}/${maxKeyRetries})...`);
        const rotation = markKeyExhausted(currentKey);
        if (rotation.success && rotation.nextKey) {
          // Retry with the rotated standby key
          continue;
        }
      }

      return response;
    } catch (err) {
      if (attempts >= maxKeyRetries) {
        throw err;
      }
    }
  }

  return fetch(input, init);
}
