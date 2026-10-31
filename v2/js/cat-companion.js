import { state, saveGame } from "./state.js";

const root = document.querySelector("#cat-companion");
if (!root) {
  console.warn("[Cat] Companion container not found.");
} else {
  state.companion ||= {
    unlocked: true,
    petCount: 0,
    talkCount: 0,
    lastInteraction: null,
    mood: "calm"
  };

  const cat = state.companion;
  const dialogue = root.querySelector("#cat-dialogue");
  const status = root.querySelector("#cat-status");
  const sprite = root.querySelector("#pixel-cat");
  const petButton = root.querySelector("#cat-pet");
  const talkButton = root.querySelector("#cat-talk");

  const petLines = [
    "呼嚕……再摸一下也不是不行。",
    "喵！有注意到本喵今天很可愛嗎？",
    "嗯……你的手還算溫暖。",
    "尾巴才不給你摸！摸頭就好！",
    "本喵今天心情不錯，准你摸摸。"
  ];
  const talkLines = [
    "今天工作室也很熱鬧呢！",
    "展示櫃裡有沒有新的漂亮石頭？",
    "本喵剛剛巡視過了，一切正常！",
    "你忙你的，本喵在旁邊陪你。",
    "如果看到亮晶晶的東西，記得叫本喵！"
  ];

  function choose(lines) {
    return lines[Math.floor(Math.random() * lines.length)];
  }

  function saveInteraction(kind) {
    cat.lastInteraction = Date.now();
    cat.mood = kind === "pet" ? "happy" : "calm";
    saveGame();
  }

  function showMood(mood, label, line) {
    root.classList.remove("is-happy", "is-sleepy");
    if (mood === "happy") root.classList.add("is-happy");
    if (mood === "sleepy") root.classList.add("is-sleepy");
    status.textContent = label;
    dialogue.textContent = line;
  }

  petButton?.addEventListener("click", () => {
    cat.petCount = (cat.petCount || 0) + 1;
    saveInteraction("pet");
    showMood("happy", "心情很好", choose(petLines));
  });

  talkButton?.addEventListener("click", () => {
    cat.talkCount = (cat.talkCount || 0) + 1;
    saveInteraction("talk");
    showMood("calm", "陪你聊天", choose(talkLines));
  });

  sprite?.addEventListener("click", () => petButton?.click());
  sprite?.addEventListener("keydown", event => {
    if (event.key === "Enter" || event.key === " ") petButton?.click();
  });

  // 小範圍散步：只在陪伴面板內左右移動，不會遮住遊戲操作區。
  let wanderDirection = 1;
  window.setInterval(() => {
    if (document.hidden) return;
    const idleFor = Date.now() - (cat.lastInteraction || 0);
    if (idleFor < 5000) return;
    wanderDirection *= -1;
    sprite.style.transform = `translateX(${wanderDirection * 12}px)`;
    if (Math.random() < 0.35) {
      showMood("calm", "正在巡視", choose([
        "本喵正在確認工作室的安全！",
        "嗯？那邊好像有亮晶晶的東西。",
        "走一走也很舒服呢。"
      ]));
    }
  }, 9000);

  console.log("[Cat] Companion initialized", {
    petCount: cat.petCount,
    talkCount: cat.talkCount
  });
}
