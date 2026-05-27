import { EVENT } from "./config.js";
import { initAnimations } from "./animations.js";

const targetDate = new Date(EVENT.targetISO).getTime();

function pad(n) {
  return String(n).padStart(2, "0");
}

function updateCountdown() {
  const distance = targetDate - Date.now();
  const els = {
    days: document.getElementById("days"),
    hours: document.getElementById("hours"),
    minutes: document.getElementById("minutes"),
    seconds: document.getElementById("seconds"),
  };

  if (distance <= 0) {
    Object.values(els).forEach((el) => {
      if (el) el.textContent = "00";
    });
    return;
  }

  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((distance % (1000 * 60)) / 1000);

  const values = { days, hours, minutes, seconds };
  for (const [key, el] of Object.entries(els)) {
    if (!el) continue;
    const next = key === "days" ? String(values[key]) : pad(values[key]);
    if (el.textContent !== next) {
      el.classList.add("tick");
      el.textContent = next;
      el.addEventListener("animationend", () => el.classList.remove("tick"), { once: true });
    }
  }
}

function initMapLinks() {
  const iframe = document.querySelector(".map-wrap iframe");
  const link = document.querySelector(".map-actions a");
  if (iframe && EVENT.mapsEmbed) iframe.src = EVENT.mapsEmbed;
  if (link && EVENT.mapsUrl) link.href = EVENT.mapsUrl;
}

function initNav() {
  const nav = document.querySelector(".nav");
  if (!nav) return;

  const onScroll = () => nav.classList.toggle("scrolled", window.scrollY > 20);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
}

function toCalendarStamp(iso) {
  const d = new Date(iso);
  const p = (n) => String(n).padStart(2, "0");
  return (
    `${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}` +
    `T${p(d.getHours())}${p(d.getMinutes())}00`
  );
}

function getCalendarUrl() {
  const start = toCalendarStamp(EVENT.targetISO);
  const end = toCalendarStamp(EVENT.calendarEndISO);
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: `Lễ Tốt Nghiệp — ${EVENT.graduateName}`,
    dates: `${start}/${end}`,
    details: `${EVENT.degree}\n${EVENT.venue}\n${EVENT.address}`,
    location: `${EVENT.venue}, ${EVENT.address}`,
  });
  return `https://calendar.google.com/calendar/render?${params}`;
}

function initWishesForm() {
  const form = document.getElementById("wish-form");
  const panel = document.getElementById("wish-success");
  const calendarBtn = document.getElementById("calendar-btn");
  if (!form || !panel) return;

  if (calendarBtn) calendarBtn.href = getCalendarUrl();

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    const name = form.name.value;
    const message = form.message.value.trim();

    if (!message) {
      form.message.focus();
      return;
    }

    btn.disabled = true;
    btn.textContent = "Đang gửi...";

    try {
      const { submitWish } = await import("./wishes.js");
      await submitWish(name, message);
      form.hidden = true;
      panel.hidden = false;
      panel.scrollIntoView({ behavior: "smooth", block: "nearest" });
      initFirebaseAnalytics();
    } catch (error) {
      console.error("Wish submit failed:", error);
      btn.disabled = false;
      btn.textContent = "Gửi Lời Chúc 💌";
      const reason = error instanceof Error ? error.message : "unknown_error";
      alert(`Không gửi được lời chúc. Lý do: ${reason}`);
    }
  });
}

function initFirebaseAnalytics() {
  const load = () => import("./firebase.js").catch(() => {});
  if ("requestIdleCallback" in window) {
    requestIdleCallback(load, { timeout: 2000 });
  } else {
    load();
  }
}

updateCountdown();
setInterval(updateCountdown, 1000);
initAnimations();
initNav();
initMapLinks();
initWishesForm();
