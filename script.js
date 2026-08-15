/* =========================================================
   GAME DATA
========================================================= */
let coins = 150;
let population = 10;
let level = 1;

let stats = { air: 20, energy: 20, waste: 20, happy: 20, nature: 20 };
let buildings = { tree: 0, solar: 0, recycle: 0, bike: 0, bus: 0, house: 0 };

const featureIcons = {
    tree: "🌳", solar: "⚡", recycle: "♻️", bike: "🚲", bus: "🚌", house: "🏠"
};

const costs = { tree: 10, solar: 20, recycle: 25, bike: 15, bus: 30, house: 35 };

let currentMiniGame = null;
let miniGameRunning = false;

/* =========================================================
   系统函数
========================================================= */
function build(type) {
    if (!buildings.hasOwnProperty(type)) return;
    if (buildings[type] >= 4) { showMessage(type.toUpperCase() + " MAX LEVEL!"); return; }
    if (coins < costs[type]) { showMessage("NOT ENOUGH ECO COINS!"); return; }
    startMiniGame(type);
}

// 升级图标：现在改为叠加数量
// 升级图标：叠加数量
function updateFeatureIcon(type) {
    const lvl = buildings[type];
    if (lvl < 1) return;

    const baseIcon = featureIcons[type] || "⭐";
    // 对应 HTML 中的 ID，例如 treeIcon
    const iconContainer = document.getElementById(type + "Icon");

    if (iconContainer) {
        iconContainer.innerHTML = ""; // 清空旧图标
        // 根据当前等级循环生成图标
        for (let j = 0; j < lvl; j++) {
            const span = document.createElement("span");
            span.innerText = baseIcon;
            span.style.margin = "1px";
            span.style.fontSize = "16px"; // 确保多图标时大小合适
            iconContainer.appendChild(span);
        }
    }
}
}

// 同步等级文字
function updateBuildingLevels() {
    for (let type in buildings) {
        const el = document.getElementById(type + "Level");
        if (el) el.innerText = buildings[type];
    }
}

function updateStats(type) {
    if (type === "tree") { stats.air += 5; stats.nature += 8; }
    if (type === "solar") { stats.energy += 10; }
    if (type === "recycle") { stats.waste += 12; }
    if (type === "bike") { stats.air += 6; }
    if (type === "bus") { stats.air += 5; }
    if (type === "house") { stats.happy += 4; }
    for (let key in stats) if (stats[key] > 100) stats[key] = 100;
    updateBars();
}

function updatePopulation() {
    population = 10 + buildings.house * 5;
    const el = document.getElementById("population");
    if (el) el.innerText = population;
}

function updateCoins() { document.getElementById("coins").innerText = coins; }
function updateBars() {
    ["air", "energy", "waste", "happy", "nature"].forEach(n => {
        const bar = document.getElementById(n);
        if (bar) bar.style.width = stats[n] + "%";
    });
}
function showMessage(text) { document.getElementById("message").innerText = text; }

/* =========================================================
   NPC 活跃系统 (漫游)
========================================================= */
const npcData = {
    npc1: { element: document.getElementById("npc1"), name: "ALEX" },
    npc2: { element: document.getElementById("npc2"), name: "MIA" },
    npc3: { element: document.getElementById("npc3"), name: "LEO" }
};

const npcDialogues = [
    "The air feels so fresh today! 🌱",
    "I love riding my bike to work! 🚲",
    "Did you sort your recycling? ♻️",
    "Our town is getting greener and greener!",
    "It's a wonderful day to plant a tree! 🌳"
];

function npcSpeak(npcID, text) {
    const npcEl = document.getElementById(npcID);
    if (!npcEl) return;
    const speech = npcEl.querySelector('.speech');
    if (!speech) return;
    
    speech.innerText = npcData[npcID].name + ": " + text;
    speech.style.display = "block";
    setTimeout(() => { 
        speech.style.display = "none"; 
    }, 3000);
}

// 随机选择活动（说话或做别的）
function npcChooseActivity(npcID) {
    const randomText = npcDialogues[Math.floor(Math.random() * npcDialogues.length)];
    npcSpeak(npcID, randomText);
}

function roamNPC(npcID) {
    const npc = npcData[npcID];
    if (!npc || !npc.element) return;

    // 让 NPC 在大地图范围内（例如 10% 到 85% 之间）随机漫游
    const randomX = Math.floor(Math.random() * 75) + 10;
    const randomY = Math.floor(Math.random() * 75) + 10;

    npc.element.style.left = randomX + "%";
    npc.element.style.top = randomY + "%";
}

function startNPC(npcID) {
    // 每隔 7 秒随机说话
    setInterval(function() { npcChooseActivity(npcID); }, 7000);
    // 每隔 4 秒随机走动一次（让 NPC 更活跃）
    setInterval(function() { roamNPC(npcID); }, 4000);
}

// 启动所有 NPC
startNPC("npc1"); 
startNPC("npc2"); 
startNPC("npc3")

/* =========================================================
   游戏逻辑与初始化
========================================================= */
function miniGameWin() {
    miniGameRunning = false;
    const type = currentMiniGame;
    coins -= costs[type];
    buildings[type]++;
    coins += (15 + buildings[type] * 5);
    updateStats(type);
    updateFeatureIcon(type);
    updateBuildingLevels();
    updateCoins();
    updatePopulation();
    closeMiniGame();
    showMessage(type.toUpperCase() + " 升级成功!");
}

function closeMiniGame() { 
    document.getElementById("minigameOverlay").style.display = "none"; 
}

// 初始化
updateBars();
updateCoins();
updatePopulation();
updateBuildingLevels();
