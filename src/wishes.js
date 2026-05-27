const SCRIPT_URL = import.meta.env.VITE_GOOGLE_SCRIPT_URL;

export async function submitWish(name, message) {
  if (!SCRIPT_URL) {
    throw new Error("Thiếu VITE_GOOGLE_SCRIPT_URL trong file .env");
  }

  const payload = {
    name: (name || "").trim() || "Ẩn danh",
    message: message.trim(),
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
