/* =========================================================
   GAME DATA
========================================================= */
let coins = 150;
let population = 10;
let level = 1;

let stats = {
    air: 20,
    energy: 20,
    waste: 20,
    happy: 20,
    nature: 20
};

let buildings = {
    tree: 0,
    solar: 0,
    recycle: 0,
    bike: 0,
    bus: 0,
    house: 0
};

/* =========================================================
   FEATURE ICONS
========================================================= */
const featureIcons = {
    tree: ["🌱", "🌿", "🌳", "🌲"],
    solar: ["🔆", "☀️", "🌞", "⚡"],
    recycle: ["🗑️", "♻️", "🔄", "♻️"],
    bike: ["🚲", "🚴", "🚴‍♀️", "🚵"],
    bus: ["🚏", "🚌", "🚍", "🚎"],
    house: ["🛖", "🏠", "🏡", "🏘️"]
};

/* =========================================================
   UPGRADE COSTS
========================================================= */
const costs = {
    tree: 10,
    solar: 20,
    recycle: 25,
    bike: 15,
    bus: 30,
    house: 35
};

/* =========================================================
   MINI GAME VARIABLES
========================================================= */
let currentMiniGame = null;
let miniTimer = 15;
let miniScore = 0;
let miniInterval = null;
let miniGameRunning = false;

/* =========================================================
   BUILD / UPGRADE
========================================================= */
function build(type) {
    if (!buildings.hasOwnProperty(type)) return;

    if (buildings[type] >= 4) {
        showMessage(type.toUpperCase() + " has reached MAX LEVEL!");
        return;
    }

    const cost = costs[type];
    if (coins < cost) {
        showMessage("NOT ENOUGH ECO COINS!");
        return;
    }

    startMiniGame(type);
}

/* =========================================================
   FEATURE ICON UPDATE
========================================================= */
function updateFeatureIcon(type) {
    const levelIndex = buildings[type] - 1;
    if (!featureIcons[type] || levelIndex < 0) return;

    const icon = featureIcons[type][levelIndex];
    const possibleIDs = [type, type + "Icon", type + "-icon", type + "Feature"];

    for (let i = 0; i < possibleIDs.length; i++) {
        const element = document.getElementById(possibleIDs[i]);
        if (element) {
            element.innerText = icon;
            return;
        }
    }

    const feature = document.querySelector('[data-feature="' + type + '"]');
    if (feature) {
        feature.innerText = icon;
    }
}

/* =========================================================
   BUILD EFFECTS
========================================================= */
function updateStats(type) {
    if (type === "tree") {
        stats.air += 5;
        stats.nature += 8;
        stats.happy += 3;
    }
    if (type === "solar") {
        stats.energy += 10;
        stats.air += 2;
    }
    if (type === "recycle") {
        stats.waste += 12;
        stats.happy += 3;
    }
    if (type === "bike") {
        stats.air += 6;
        stats.happy += 5;
    }
    if (type === "bus") {
        stats.air += 5;
        stats.happy += 6;
    }
    if (type === "house") {
        stats.happy += 4;
    }

    for (let key in stats) {
        if (stats[key] > 100) stats[key] = 100;
    }
    updateBars();
}

/* =========================================================
   POPULATION
========================================================= */
function updatePopulation() {
    population = 10 + buildings.house * 5;
    const element = document.getElementById("population");
    if (element) {
        element.innerText = population;
    }
}

/* =========================================================
   LEVEL
========================================================= */
function checkLevel() {
    const average = (stats.air + stats.energy + stats.waste + stats.happy + stats.nature) / 5;
    let newLevel = 1;

    if (average >= 35) newLevel = 2;
    if (average >= 50) newLevel = 3;
    if (average >= 70) newLevel = 4;
    if (average >= 90) newLevel = 5;

    if (newLevel > level) {
        level = newLevel;
        const levelEl = document.getElementById("level");
        if (levelEl) levelEl.innerText = level;
        coins += 50;
        updateCoins();
        showPopup("LEVEL UP!", "Your eco town reached LEVEL " + level + "! +50 ECO COINS!");
    }
}

/* =========================================================
   BARS & COINS & MESSAGE & POPUP
========================================================= */
function updateBars() {
    const names = ["air", "energy", "waste", "happy", "nature"];
    names.forEach(function(name) {
        const bar = document.getElementById(name);
        const text = document.getElementById(name + "Text");
        if (bar) bar.style.width = stats[name] + "%";
        if (text) text.innerText = stats[name] + "%";
    });
}

function updateCoins() {
    const element = document.getElementById("coins");
    if (element) element.innerText = coins;
}

function showMessage(text) {
    const element = document.getElementById("message");
    if (element) element.innerText = text;
}

function showPopup(title, text) {
    const titleElement = document.getElementById("popupTitle");
    const textElement = document.getElementById("popupText");
    const popup = document.getElementById("popup");
    if (titleElement) titleElement.innerText = title;
    if (textElement) textElement.innerText = text;
    if (popup) popup.style.display = "block";
}

function closePopup() {
    const popup = document.getElementById("popup");
    if (popup) popup.style.display = "none";
}

/* =========================================================
   MISSION
========================================================= */
let missionComplete = false;
function checkMission() {
    if (buildings.tree >= 3 && !missionComplete) {
        missionComplete = true;
        coins += 50;
        updateCoins();
        const mission = document.getElementById("mission");
        if (mission) mission.innerText = "QUEST COMPLETE!";
        showPopup("QUEST COMPLETE!", "You planted 3 trees! +50 ECO COINS!");
    }
}

/* =========================================================
   NPC LOGIC
========================================================= */
const npcData = {
    npc1: { element: document.getElementById("npc1"), speech: document.getElementById("speech1"), name: "ALEX", personality: "cycling" },
    npc2: { element: document.getElementById("npc2"), speech: document.getElementById("speech2"), name: "MIA", personality: "recycling" },
    npc3: { element: document.getElementById("npc3"), speech: document.getElementById("speech3"), name: "LEO", personality: "nature" }
};

const activities = {
    tree: { message: "The trees make this town beautiful!", x: 13, y: 18 },
    solar: { message: "Clean energy is the future!", x: 82, y: 18 },
    recycle: { message: "Time to recycle!", x: 13, y: 70 },
    bike: { message: "Let's go cycling!", x: 80, y: 70 },
    bus: { message: "The bus is coming!", x: 58, y: 28 },
    house: { message: "This is a nice place to live!", x: 20, y: 30 }
};

function npcSpeak(npcID, text) {
    const npc = npcData[npcID];
    if (!npc || !npc.speech) return;
    npc.speech.innerText = npc.name + ": " + text;
    npc.speech.style.display = "block";
    setTimeout(function() {
        npc.speech.style.display = "none";
    }, 4500);
}

function moveNPC(npcID, type) {
    const npc = npcData[npcID];
    const activity = activities[type];
    if (!npc || !npc.element || !activity) return;
    npc.element.style.left = activity.x + "%";
    npc.element.style.top = activity.y + "%";
    setTimeout(function() {
        npcSpeak(npcID, activity.message);
    }, 6000);
}

function npcChooseActivity(npcID) {
    const npc = npcData[npcID];
    if (!npc) return;
    let preferred = [];
    if (npc.personality === "cycling") {
        if (buildings.bike > 0) preferred.push("bike");
        if (buildings.bus > 0) preferred.push("bus");
    }
    if (npc.personality === "recycling") {
        if (buildings.recycle > 0) preferred.push("recycle");
    }
    if (npc.personality === "nature") {
        if (buildings.tree > 0) preferred.push("tree");
    }
    if (preferred.length === 0) {
        for (let type in buildings) {
            if (buildings[type] > 0 && activities[type]) preferred.push(type);
        }
    }
    if (preferred.length === 0) {
        npcSpeak(npcID, "The town needs more facilities!");
        return;
    }
    const choice = preferred[Math.floor(Math.random() * preferred.length)];
    moveNPC(npcID, choice);
}

function startNPC(npcID) {
    setInterval(function() { npcChooseActivity(npcID); }, 12000);
}

startNPC("npc1");
startNPC("npc2");
startNPC("npc3");

/* =========================================================
   WEATHER & TIME & WILDLIFE & EVENTS
========================================================= */
const weatherTypes = ["sunny", "rainy", "cloudy"];

function changeWeather() {
    const type = weatherTypes[Math.floor(Math.random() * weatherTypes.length)];
    const city = document.getElementById("city");
    const weather = document.getElementById("weather");
    const sun = document.querySelector(".sun");
    const clouds = document.querySelectorAll(".cloud");
    const rain = document.querySelector(".rain");
    const rainbow = document.querySelector(".rainbow");

    if (city) city.style.backgroundColor = "#6fa84b";
    if (sun) sun.style.display = "none";
    if (rain) rain.style.display = "none";
    if (rainbow) rainbow.style.display = "none";
    clouds.forEach(function(cloud) { cloud.style.display = "none"; });

    if (type === "sunny") {
        if (weather) weather.innerText = " SUNNY";
        if (sun) sun.style.display = "block";
    }
    if (type === "rainy") {
        if (weather) weather.innerText = "🌧️ RAINY";
        if (city) city.style.backgroundColor = "#638c86";
        if (rain) rain.style.display = "block";
        clouds.forEach(function(cloud) { cloud.style.display = "block"; });
    }
    if (type === "cloudy") {
        if (weather) weather.innerText = "☁️ CLOUDY";
        if (city) city.style.backgroundColor = "#789c86";
        clouds.forEach(function(cloud) { cloud.style.display = "block"; });
    }
}
setInterval(changeWeather, 20000);

let isNight = false;
function changeTime() {
    const city = document.querySelector(".city");
    isNight = !isNight;
    if (isNight) {
        city.classList.add("night");
    } else {
        city.classList.remove("night");
    }
}
setInterval(changeTime, 60000);

function updateWildlife() {
    const bird = document.getElementById("bird");
    const butterfly = document.getElementById("butterfly");
    const squirrel = document.getElementById("squirrel");
    if (bird) bird.style.display = stats.nature >= 30 ? "block" : "none";
    if (butterfly) butterfly.style.display = stats.nature >= 50 ? "block" : "none";
    if (squirrel) squirrel.style.display = stats.nature >= 70 ? "block" : "none";
}

const challenges = [
    "♻️ Recycle something today!",
    "💡 Turn off an unnecessary light!",
    "💧 Save some water today!",
    "🌳 Take care of a plant!",
    "🚶 Walk for a short trip!",
    "🥤 Use a reusable bottle!"
];

function completeChallenge() {
    coins += 20;
    updateCoins();
    showPopup("REAL WORLD QUEST!", "Great job helping the environment! +20 ECO COINS!");
    const next = challenges[Math.floor(Math.random() * challenges.length)];
    const challengeText = document.getElementById("challengeText");
    if (challengeText) challengeText.innerText = next;
}

const events = [
    "Volunteers planted trees!",
    "Citizens organized a recycling day!",
    "More people are cycling today!",
    "The park received new plants!",
    "A clean-up event happened near the road!"
];

function randomEvent() {
    const event = events[Math.floor(Math.random() * events.length)];
    const eventText = document.getElementById("eventText");
    if (eventText) eventText.innerText = event;
    if (event.includes("trees")) stats.nature += 4;
    if (event.includes("recycling")) stats.waste += 3;
    if (event.includes("cycling")) stats.air += 3;
    for (let key in stats) {
        if (stats[key] > 100) stats[key] = 100;
    }
    updateBars();
    updateWildlife();
}
setInterval(randomEvent, 20000);

/* =========================================================
   MINI GAME SYSTEM (Tree, Solar, Recycle, Bike, Bus, House)
========================================================= */
function startMiniGame(type) {
    currentMiniGame = type;
    miniScore = 0;
    miniTimer = 30;
    miniGameRunning = true;

    const overlay = document.getElementById("minigameOverlay");
    if (!overlay) {
        miniGameRunning = false;
        return;
    }
    overlay.style.display = "flex";
    document.getElementById("miniScore").innerText = "0";
    document.getElementById("miniTimer").innerText = "30";
    document.getElementById("miniGameMessage").innerText = "";

    if (type === "tree") startTreeGame();
    else if (type === "solar") startSolarGame();
    else if (type === "recycle") startRecycleGame();
    else if (type === "bike") startBikeGame();
    else if (type === "bus") startBusGame();
    else if (type === "house") startHouseGame();
}

function miniGameWin() {
    if (!miniGameRunning) return;
    miniGameRunning = false;
    clearInterval(miniInterval);

    const type = currentMiniGame;
    const cost = costs[type];
    const reward = 15 + buildings[type] * 10;

    coins -= cost;
    buildings[type]++;
    coins += reward;

    updateStats(type);
    updateFeatureIcon(type);
    updateCoins();
    updatePopulation();
    updateWildlife();
    checkMission();
    checkLevel();

    const message = document.getElementById("miniGameMessage");
    if (message) message.innerText = "🎉 SUCCESS!";

    setTimeout(function() {
        closeMiniGame();
        showMessage(type.toUpperCase() + " upgraded to LEVEL " + buildings[type] + "! +" + reward + " 🪙");
    }, 900);
}

function closeMiniGame() {
    miniGameRunning = false;
    clearInterval(miniInterval);
    const overlay = document.getElementById("minigameOverlay");
    const area = document.getElementById("miniGameArea");
    if (overlay) overlay.style.display = "none";
    if (area) area.innerHTML = "";
    currentMiniGame = null;
}

// 占位小游戏实现函数（实际完整逻辑可参考源码中的对应方法）
function startTreeGame() { /* 树木小游戏逻辑 */ }
function startSolarGame() { /* 太阳能小游戏逻辑 */ }
function startRecycleGame() { /* 回收小游戏逻辑 */ }
function startBikeGame() { /* 单车小游戏逻辑 */ }
function startBusGame() { /* 公交小游戏逻辑 */ }
function startHouseGame() { /* 房屋小游戏逻辑 */ }

/* =========================================================
   WORLD CAMERA (DRAG TO MOVE MAP)
========================================================= */
const cityEl = document.getElementById("city");
const worldMapEl = document.getElementById("worldMap");

let cameraX = 0;
let cameraY = 0;
let dragging = false;
let mouseStartX = 0;
let mouseStartY = 0;

if (cityEl) {
    cityEl.addEventListener("mousedown", function(e) {
        dragging = true;
        mouseStartX = e.clientX;
        mouseStartY = e.clientY;
        cityEl.style.cursor = "grabbing";
    });
}

document.addEventListener("mouseup", function() {
    dragging = false;
    if (cityEl) cityEl.style.cursor = "grab";
});

if (cityEl) {
    cityEl.addEventListener("mousemove", function(e) {
        if (!dragging) return;
        const dx = e.clientX - mouseStartX;
        const dy = e.clientY - mouseStartY;
        cameraX += dx;
        cameraY += dy;
        mouseStartX = e.clientX;
        mouseStartY = e.clientY;
        updateCamera();
    });
}

function updateCamera() {
    if (!worldMapEl || !cityEl) return;
    const maxX = worldMapEl.offsetWidth - cityEl.clientWidth;
    const maxY = worldMapEl.offsetHeight - cityEl.clientHeight;
    cameraX = Math.max(-maxX, Math.min(0, cameraX));
    cameraY = Math.max(-maxY, Math.min(0, cameraY));
    worldMapEl.style.transform = "translate(" + cameraX + "px, " + cameraY + "px)";
}

if (cityEl) {
    cityEl.style.cursor = "grab";
    updateCamera();
}

/* =========================================================
   INITIALIZE
========================================================= */
updateBars();
updateCoins();
updatePopulation();
updateWildlife();
changeWeather();