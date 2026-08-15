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
function updateFeatureIcon(type) {
    const level = buildings[type];
    if (level < 1) { return; }

    // 取出该建筑的基础图标（取第一个作为代表）
    const icon = featureIcons[type] ? featureIcons[type][0] : "⭐";
    const possibleIDs = [type, type + "Icon", type + "-icon", type + "Feature"];

    for (let i = 0; i < possibleIDs.length; i++) {
        const element = document.getElementById(possibleIDs[i]);
        if (element) {
            element.innerHTML = ""; // 清空旧图标
            for (let j = 0; j < level; j++) {
                const span = document.createElement("span");
                span.innerText = icon;
                span.style.margin = "1px";
                element.appendChild(span);
            }
            return;
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

function npcSpeak(npcID, text) {
    const npcEl = document.getElementById(npcID);
    const speech = npcEl.querySelector('.speech');
    speech.innerText = npcData[npcID].name + ": " + text;
    speech.style.display = "block";
    setTimeout(() => { speech.style.display = "none"; }, 3000);
}

function roamNPC(npcID) {
    const npc = npcData[npcID].element;
    const x = Math.floor(Math.random() * 85) + 5;
    const y = Math.floor(Math.random() * 85) + 5;
    npc.style.left = x + "%";
    npc.style.top = y + "%";
}

function startNPC(npcID) {
    setInterval(() => roamNPC(npcID), 5000); // 每5秒随机跑动
    setInterval(() => {
        if(Math.random() > 0.7) npcSpeak(npcID, "这城市真美!");
    }, 8000);
}

startNPC("npc1"); startNPC("npc2"); startNPC("npc3");

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
