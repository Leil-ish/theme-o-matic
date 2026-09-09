// --- the "calculator" core -------------------------------------------------
// A deterministic string hash (djb2), used to turn (date + level) into a
// reproducible index. Same date + same level = same theme, for anyone,
// anywhere, with no server involved.
function djb2Hash(str) {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 33) ^ str.charCodeAt(i);
  }
  return Math.abs(hash >>> 0);
}

function todayString() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

const EPOCH = new Date("2026-01-01T00:00:00");
function dayNumber() {
  const now = new Date();
  const diffMs = now.setHours(0, 0, 0, 0) - EPOCH.setHours(0, 0, 0, 0);
  return Math.max(0, Math.floor(diffMs / 86400000)) + 1;
}

function themeForDate(dateStr, level) {
  const pool = THEMES[level].list;
  const idx = djb2Hash(`${dateStr}::level${level}`) % pool.length;
  return pool[idx];
}

function randomTheme(level) {
  const pool = THEMES[level].list;
  const idx = Math.floor(Math.random() * pool.length);
  return pool[idx];
}

// --- UI wiring ---------------------------------------------------------
const slider = document.getElementById("unhinged-slider");
const levelName = document.getElementById("level-name");
const levelBadge = document.getElementById("level-badge");
const themeText = document.getElementById("theme-text");
const dayCounter = document.getElementById("day-counter");
const todayBtn = document.getElementById("today-btn");
const rerollBtn = document.getElementById("reroll-btn");
const historyList = document.getElementById("history-list");
const clearHistoryBtn = document.getElementById("clear-history");

const LEVEL_LABELS = { 1: "wholesome", 2: "spicy", 3: "chaotic", 4: "feral", 5: "unhinged" };
const HISTORY_KEY = "theme-o-matic-history";

function currentLevel() {
  return Number(slider.value);
}

function updateLevelLabel() {
  const lvl = currentLevel();
  levelName.textContent = `${lvl} — ${LEVEL_LABELS[lvl]}`;
  document.body.dataset.level = lvl;
}

function setTheme(text, level, tag) {
  themeText.textContent = text;
  levelBadge.textContent = `Lv.${level} ${LEVEL_LABELS[level]}`;
  saveToHistory(text, level, tag);
}

function loadHistory() {
  try {
    return JSON.parse(localStorage.getItem(HISTORY_KEY)) || [];
  } catch {
    return [];
  }
}

function saveToHistory(text, level, tag) {
  const history = loadHistory();
  // avoid spamming duplicate entries when "today's theme" reloads/re-clicks
  if (history[0] && history[0].text === text && history[0].level === level) {
    return;
  }
  history.unshift({ text, level, tag, when: new Date().toLocaleDateString() });
  const trimmed = history.slice(0, 25);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(trimmed));
  renderHistory();
}

function renderHistory() {
  const history = loadHistory();
  historyList.innerHTML = "";
  if (history.length === 0) {
    const li = document.createElement("li");
    li.className = "empty";
    li.textContent = "nothing generated yet";
    historyList.appendChild(li);
    return;
  }
  for (const entry of history) {
    const li = document.createElement("li");
    li.innerHTML = `<span class="hist-tag">Lv.${entry.level}</span><span class="hist-text">${entry.text}</span><span class="hist-when">${entry.when}</span>`;
    historyList.appendChild(li);
  }
}

todayBtn.addEventListener("click", () => {
  const lvl = currentLevel();
  const text = themeForDate(todayString(), lvl);
  setTheme(text, lvl, "official");
});

rerollBtn.addEventListener("click", () => {
  const lvl = currentLevel();
  const text = randomTheme(lvl);
  setTheme(text, lvl, "reroll");
});

slider.addEventListener("input", updateLevelLabel);

clearHistoryBtn.addEventListener("click", () => {
  localStorage.removeItem(HISTORY_KEY);
  renderHistory();
});

// init
updateLevelLabel();
dayCounter.textContent = String(dayNumber()).padStart(6, "0");
renderHistory();
// auto-show today's theme at the default level on load
setTheme(themeForDate(todayString(), currentLevel()), currentLevel(), "official");
