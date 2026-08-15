let coins = 150;
let population = 10;
let level = 1;

let stats = { air: 20, energy: 20, waste: 20, happy: 20, nature: 20 };
let buildings = { tree: 0, solar: 0, recycle: 0, bike: 0, bus: 0, house: 0 };

const featureIcons = {
    tree: ["🌱", "🌿", "🌳", "🌲"],
    solar: ["🔆", "☀️", "🌞", "⚡"],
    recycle: ["🗑️", "♻️", "🔄", "♻️"],
    bike: ["🚲", "🚴", "🚴‍♀️", "🚵"],
    bus: ["🚏", "🚌", "🚍", "🚎"],
    house: ["🛖", "🏠", "🏡", "🏘️"]
};

const costs = { tree: 10, solar: 20, recycle: 25, bike: 15, bus: 30, house: 35 };

let currentMiniGame = null;
let miniTimer = 15;
let miniScore = 0;
let miniInterval = null;
let miniGameRunning = false;

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

function updateFeatureIcon(type) {
    const levelIndex = buildings[type] - 1;
    if (!featureIcons[type] || levelIndex < 0) return;

    const icon = featureIcons[type][levelIndex];
    
    const possibleIDs = [type, type + "Icon", type + "-icon", type + "Feature"];
    for (let i = 0; i < possibleIDs.length; i++) {
        const element = document.getElementById(possibleIDs[i]);
        if (element) {
            element.innerText = icon;
            break;
        }
    }

    if (type === 'house') {
        const houseIcon2 = document.getElementById("houseIcon2");
        if (houseIcon2) houseIcon2.innerText = icon;
        const houseLevel2 = document.getElementById("houseLevel2");
        if (houseLevel2) houseLevel2.innerText = buildings.house;
    }

    const levelElement = document.getElementById(type + "Level");
    if (levelElement) {
        levelElement.innerText = buildings[type];
    }
}

function updateStats(type) {
    if (type === "tree") { stats.air += 5; stats.nature += 8; stats.happy += 3; }
    if (type === "solar") { stats.energy += 10; stats.air += 2; }
    if (type === "recycle") { stats.waste += 12; stats.happy += 3; }
    if (type === "bike") { stats.air += 6; stats.happy += 5; }
    if (type === "bus") { stats.air += 5; stats.happy += 6; }
    if (type === "house") { stats.happy += 4; }

    for (let key in stats) {
        if (stats[key] > 100) stats[key] = 100;
    }
    updateBars();
}

function updatePopulation() {
    population = 10 + buildings.house * 5;
    const element = document.getElementById("population");
    if (element) element.innerText = population;
}

function checkLevel() {
    const average = (stats.air + stats.energy + stats.waste + stats.happy + stats.nature) / 5;
    let newLevel = 1;
    if (average >= 35) newLevel = 2;
    if (average >= 50) newLevel = 3;
    if (average >= 70) newLevel = 4;
    if (average >= 90) newLevel = 5;

    if (newLevel > level) {
        level = newLevel;
        const levelElement = document.getElementById("level");
        if (levelElement) levelElement.innerText = level;
        coins += 50;
        updateCoins();
        showPopup("LEVEL UP!", "Your eco town reached LEVEL " + level + "! +50 ECO COINS!");
    }
}

function updateBars() {
    ["air", "energy", "waste", "happy", "nature"].forEach(name => {
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

function completeChallenge() {
    coins += 20;
    updateCoins();
    showPopup("REAL WORLD QUEST!", "Great job helping the environment! +20 ECO COINS!");
    const challenges = ["♻️ Recycle something today!", "💡 Turn off an unnecessary light!", "💧 Save some water today!"];
    const next = challenges[Math.floor(Math.random() * challenges.length)];
    const challengeText = document.getElementById("challengeText");
    if (challengeText) challengeText.innerText = next;
}

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
    setTimeout(() => { npc.speech.style.display = "none"; }, 4500);
}

function moveNPC(npcID, type) {
    const npc = npcData[npcID];
    const activity = activities[type];
    if (!npc || !npc.element || !activity) return;
    npc.element.style.left = activity.x + "%";
    npc.element.style.top = activity.y + "%";
    setTimeout(() => { npcSpeak(npcID, activity.message); }, 6000);
}

function npcChooseActivity(npcID) {
    const npc = npcData[npcID];
    if (!npc) return;
    let preferred = [];
    if (npc.personality === "cycling") {
        if (buildings.bike > 0) preferred.push("bike");
        if (buildings.bus > 0) preferred.push("bus");
    }
    if (npc.personality === "recycling" && buildings.recycle > 0) preferred.push("recycle");
    if (npc.personality === "nature" && buildings.tree > 0) preferred.push("tree");

    if (preferred.length === 0) {
        for (let type in buildings) {
            if (buildings[type] > 0 && activities[type]) preferred.push(type);
        }
    }
    if (preferred.length === 0) return;
    const choice = preferred[Math.floor(Math.random() * preferred.length)];
    moveNPC(npcID, choice);
}

["npc1", "npc2", "npc3"].forEach(id => {
    setInterval(() => npcChooseActivity(id), 12000);
    const el = document.getElementById(id);
    if (el) {
        el.addEventListener("click", () => npcSpeak(id, "Hello, Mayor! Enjoying the town."));
    }
});

const weatherTypes = ["sunny", "rainy", "cloudy"];
function changeWeather() {
    const type = weatherTypes[Math.floor(Math.random() * weatherTypes.length)];
    const cityEl = document.getElementById("city");
    const weather = document.getElementById("weather");
    const sun = document.querySelector(".sun");
    const clouds = document.querySelectorAll(".cloud");
    const rain = document.querySelector(".rain");

    if (cityEl) cityEl.style.backgroundColor = "#6fa84b";
    if (sun) sun.style.display = "none";
    if (rain) rain.style.display = "none";
    clouds.forEach(c => c.style.display = "none");

    if (type === "sunny") {
        if (weather) weather.innerText = " SUNNY";
        if (sun) sun.style.display = "block";
    } else if (type === "rainy") {
        if (weather) weather.innerText = "🌧️ RAINY";
        if (cityEl) cityEl.style.backgroundColor = "#638c86";
        if (rain) rain.style.display = "block";
        clouds.forEach(c => c.style.display = "block");
    } else if (type === "cloudy") {
        if (weather) weather.innerText = "☁️ CLOUDY";
        if (cityEl) cityEl.style.backgroundColor = "#789c86";
        clouds.forEach(c => c.style.display = "block");
    }
}
setInterval(changeWeather, 20000);

let isNight = false;
function changeTime() {
    const cityEl = document.querySelector(".city");
    isNight = !isNight;
    if (isNight) cityEl.classList.add("night");
    else cityEl.classList.remove("night");
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

function startMiniGame(type) {
    currentMiniGame = type;
    miniScore = 0;
    miniTimer = 15;
    miniGameRunning = true;

    const overlay = document.getElementById("minigameOverlay");
    if (!overlay) return;
    overlay.style.display = "flex";

    document.getElementById("miniScore").innerText = "0";
    document.getElementById("miniTimer").innerText = miniTimer;
    document.getElementById("miniGameMessage").innerText = "Game started!";

    clearInterval(miniInterval);
    miniInterval = setInterval(() => {
        if (!miniGameRunning) {
            clearInterval(miniInterval);
            return;
        }
        miniTimer--;
        const timerEl = document.getElementById("miniTimer");
        if (timerEl) timerEl.innerText = miniTimer;

        if (miniTimer <= 0) {
            clearInterval(miniInterval);
            miniGameLose();
        }
    }, 1000);

    startTreeGame();
}

function startTreeGame() {
    const area = document.getElementById("miniGameArea");
    area.innerHTML = "<p style='color:#f4e6a2;'>Click the falling items quickly! (Catch 5)</p>";
    let clicked = 0;
    const spawner = setInterval(() => {
        if (!miniGameRunning) { clearInterval(spawner); return; }
        const seed = document.createElement("button");
        seed.innerText = "🌱";
        seed.style.position = "absolute";
        seed.style.left = (Math.random() * 80) + "%";
        seed.style.top = (Math.random() * 70) + "%";
        seed.style.fontSize = "30px";
        seed.onclick = () => {
            clicked++;
            miniScore = clicked;
            document.getElementById("miniScore").innerText = miniScore;
            seed.remove();
            if (clicked >= 5) {
                clearInterval(spawner);
                miniGameWin();
            }
        };
        area.appendChild(seed);
        setTimeout(() => { if (seed.parentNode) seed.remove(); }, 1500);
    }, 800);
}

function miniGameWin() {
    if (!miniGameRunning) return;
    miniGameRunning = false;
    clearInterval(miniInterval);

    const type = currentMiniGame;
    const cost = costs[type];
    const reward = 15 + buildings[type] * 10;

    coins = coins - cost + reward;
    buildings[type]++;

    updateStats(type);
    updateFeatureIcon(type);
    updateCoins();
    updatePopulation();
    updateWildlife();
    checkMission();
    checkLevel();

    document.getElementById("miniGameMessage").innerText = "🎉 SUCCESS!";
    setTimeout(() => {
        closeMiniGame();
        showMessage(type.toUpperCase() + " upgraded to LEVEL " + buildings[type] + "! +" + reward + " 🪙");
    }, 900);
}

function miniGameLose() {
    if (!miniGameRunning) return;
    miniGameRunning = false;
    clearInterval(miniInterval);
    document.getElementById("miniGameMessage").innerText = "⏰ TIME'S UP!";
    setTimeout(() => {
        closeMiniGame();
        showMessage("Challenge failed! Try again.");
    }, 900);
}

function closeMiniGame() {
    miniGameRunning = false;
    clearInterval(miniInterval);
    const overlay = document.getElementById("minigameOverlay");
    if (overlay) overlay.style.display = "none";
    const area = document.getElementById("miniGameArea");
    if (area) area.innerHTML = "";
    currentMiniGame = null;
}

const cityView = document.getElementById("city");
const worldMap = document.getElementById("worldMap");
let cameraX = 0, cameraY = 0, dragging = false, mouseStartX = 0, mouseStartY = 0;

cityView.addEventListener("mousedown", (e) => {
    dragging = true;
    mouseStartX = e.clientX;
    mouseStartY = e.clientY;
    cityView.style.cursor = "grabbing";
});

document.addEventListener("mouseup", () => {
    dragging = false;
    cityView.style.cursor = "grab";
});

cityView.addEventListener("mousemove", (e) => {
    if (!dragging) return;
    cameraX += e.clientX - mouseStartX;
    cameraY += e.clientY - mouseStartY;
    mouseStartX = e.clientX;
    mouseStartY = e.clientY;
    updateCamera();
});

function updateCamera() {
    const maxX = worldMap.offsetWidth - cityView.clientWidth;
    const maxY = worldMap.offsetHeight - cityView.clientHeight;
    cameraX = Math.max(-maxX, Math.min(0, cameraX));
    cameraY = Math.max(-maxY, Math.min(0, cameraY));
    worldMap.style.transform = `translate(${cameraX}px, ${cameraY}px)`;
}

cityView.style.cursor = "grab";
updateCamera();

updateBars();
updateCoins();
updatePopulation();
updateWildlife();
changeWeather();
