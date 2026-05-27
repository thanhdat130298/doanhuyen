const SCRIPT_URL = import.meta.env.VITE_GOOGLE_SCRIPT_URL;

function detectDeviceType(userAgent) {
  const ua = userAgent.toLowerCase();
  if (/tablet|ipad/.test(ua)) return "tablet";
  if (/mobi|android|iphone|ipod/.test(ua)) return "mobile";
  return "desktop";
}

function collectClientMeta() {
  const userAgent = navigator.userAgent || "";
  return {
    userAgent,
    deviceType: detectDeviceType(userAgent),
    platform: navigator.userAgentData?.platform || navigator.platform || "unknown",
    language: navigator.language || "unknown",
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "unknown",
    screen: `${window.screen.width}x${window.screen.height}`,
    referrer: document.referrer || "",
    page: window.location.href,
    sentAt: new Date().toISOString(),
  };
}

export async function submitWish(name, message) {
  if (!SCRIPT_URL) {
    throw new Error("Thiếu VITE_GOOGLE_SCRIPT_URL trong file .env");
  }

  const payload = {
    name: (name || "").trim() || "Ẩn danh",
    message: message.trim(),
    client: collectClientMeta(),
  };

  const res = await fetch(SCRIPT_URL, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`);
  }

  const data = await res.json().catch(() => ({}));
  if (data && data.ok === false) {
    throw new Error(data.error || "submit_failed");
  }
}
