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
    if (!buildings.hasOwnProperty(type)) {
        return;
    }

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
   FEATURE ICON UPDATE (DYNAMIC LEVEL UP ICONS)
========================================================= */
function updateFeatureIcon(type) {
    const levelIndex = buildings[type] - 1;
    if (!featureIcons[type] || levelIndex < 0) return;

    const icon = featureIcons[type][Math.min(levelIndex, featureIcons[type].length - 1)];

    const iconElement = document.getElementById(type + "Icon") || document.getElementById(type + "Icon2");
    if (iconElement) {
        iconElement.innerText = icon;
    } else {
        const buildingEl = document.querySelector("." + type);
        if (buildingEl) {
            const feat = buildingEl.querySelector(".feature-icon");
            if (feat) feat.innerText = icon;
        }
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
        if (stats[key] > 100) {
            stats[key] = 100;
        }
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
    const average = (
        stats.air +
        stats.energy +
        stats.waste +
        stats.happy +
        stats.nature
    ) / 5;

    let newLevel = 1;
    if (average >= 35) newLevel = 2;
    if (average >= 50) newLevel = 3;
    if (average >= 70) newLevel = 4;
    if (average >= 90) newLevel = 5;

    if (newLevel !== level) {
        const oldLevel = level;
        level = newLevel;

        const levelElement = document.getElementById("level");
        if (levelElement) {
            levelElement.innerText = level;
        }

        if (newLevel > oldLevel) {
            coins += 50;
            updateCoins();
            showPopup(
                "LEVEL UP!",
                "Your eco town reached LEVEL " + level + "! +50 ECO COINS!"
            );
        }
    }
}

/* =========================================================
   BARS & COINS & MESSAGES & POPUPS
========================================================= */
function updateBars() {
    const names = ["air", "energy", "waste", "happy", "nature"];
    names.forEach(function(name) {
        const bar = document.getElementById(name);
        const text = document.getElementById(name + "Text");
        if (bar) {
            bar.style.width = stats[name] + "%";
        }
        if (text) {
            text.innerText = stats[name] + "%";
        }
    });
}

function updateCoins() {
    const element = document.getElementById("coins");
    if (element) {
        element.innerText = coins;
    }
}

function showMessage(text) {
    const element = document.getElementById("message");
    if (element) {
        element.innerText = text;
    }
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
        if (mission) {
            mission.innerText = "QUEST COMPLETE!";
        }

        showPopup("QUEST COMPLETE!", "You planted 3 trees! +50 ECO COINS!");
    }
}

/* =========================================================
   NPC DATA & MORE ACTIVE ROUTINE
========================================================= */
const npcData = {
    npc1: { element: document.getElementById("npc1"), speech: document.getElementById("speech1"), name: "ALEX" },
    npc2: { element: document.getElementById("npc2"), speech: document.getElementById("speech2"), name: "MIA" },
    npc3: { element: document.getElementById("npc3"), speech: document.getElementById("speech3"), name: "LEO" }
};

const activeActivities = [
    { message: "The air feels so fresh here!", x: 15, y: 15 },
    { message: "Check out this clean energy!", x: 75, y: 15 },
    { message: "Recycling keeps our town clean!", x: 15, y: 75 },
    { message: "I love riding my bike on these lanes!", x: 75, y: 75 },
    { message: "Waiting for the eco-bus!", x: 48, y: 35 },
    { message: "Such a peaceful neighborhood.", x: 35, y: 45 },
    { message: "Look at all the green plants!", x: 60, y: 25 }
];

function npcSpeak(npcID, text) {
    const npc = npcData[npcID];
    if (!npc || !npc.speech) return;

    npc.speech.innerText = npc.name + ": " + text;
    npc.speech.style.display = "block";

    setTimeout(function() {
        npc.speech.style.display = "none";
    }, 3500);
}

function makeNpcMoreActive(npcID) {
    setInterval(function() {
        const npc = npcData[npcID];
        if (!npc || !npc.element) return;

        const randomAct = activeActivities[Math.floor(Math.random() * activeActivities.length)];
        npc.element.style.left = randomAct.x + "%";
        npc.element.style.top = randomAct.y + "%";

        setTimeout(function() {
            npcSpeak(npcID, randomAct.message);
        }, 3000);

    }, 7000);
}

makeNpcMoreActive("npc1");
makeNpcMoreActive("npc2");
makeNpcMoreActive("npc3");

["npc1", "npc2", "npc3"].forEach((id, idx) => {
    const el = document.getElementById(id);
    const msgs = ["I love cycling around town!", "Remember to recycle!", "Look at those trees!"];
    if (el) {
        el.addEventListener("click", () => npcSpeak(id, msgs[idx]));
    }
});

/* =========================================================
   WEATHER & DAY/NIGHT
========================================================= */
const weatherTypes = ["sunny", "rainy", "cloudy"];

function changeWeather() {
    const type = weatherTypes[Math.floor(Math.random() * weatherTypes.length)];
    const city = document.getElementById("city");
    const weather = document.getElementById("weather");
    const sun = document.querySelector(".sun");
    const clouds = document.querySelectorAll(".cloud");
    const rain = document.querySelector(".rain");

    if (city) city.style.backgroundColor = "#6fa84b";
    if (sun) sun.style.display = "none";
    if (rain) rain.style.display = "none";
    clouds.forEach(c => c.style.display = "none");

    if (type === "sunny") {
        if (weather) weather.innerText = " SUNNY";
        if (sun) sun.style.display = "block";
    } else if (type === "rainy") {
        if (weather) weather.innerText = "🌧️ RAINY";
        if (city) city.style.backgroundColor = "#638c86";
        if (rain) rain.style.display = "block";
        clouds.forEach(c => c.style.display = "block");
    } else if (type === "cloudy") {
        if (weather) weather.innerText = "☁️ CLOUDY";
        if (city) city.style.backgroundColor = "#789c86";
        clouds.forEach(c => c.style.display = "block");
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

/* =========================================================
   WILDLIFE & CHALLENGES & EVENTS
========================================================= */
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
   MINI GAME SYSTEM & MINIGAMES
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
    document.getElementById("miniGameMessage").innerText = "30";

    if (type === "tree") startTreeGame();
    else if (type === "solar") startSolarGame();
    else if (type === "recycle") startRecycleGame();
    else if (type === "bike") startBikeGame();
    else if (type === "bus") startBusGame();
    else if (type === "house") startHouseGame();
}

function startTreeGame() {
    const title = document.getElementById("miniGameTitle");
    const description = document.getElementById("miniGameDescription");
    const area = document.getElementById("miniGameArea");

    title.innerText = "🌳 SEED CATCHER";
    description.innerText = "Move the basket and catch the falling seeds!";
    area.innerHTML = "";

    let basketX = 42;
    let caught = 0;
    const target = 10;

    const basket = document.createElement("div");
    basket.className = "seed-basket";
    basket.innerText = "🧺";
    basket.style.position = "absolute";
    basket.style.bottom = "8px";
    basket.style.left = basketX + "%";
    basket.style.fontSize = "42px";
    basket.style.width = "55px";
    basket.style.textAlign = "center";
    basket.style.transition = "left 0.08s linear";
    area.appendChild(basket);

    let leftPressed = false;
    let rightPressed = false;

    function keyDown(event) {
        if (event.key === "ArrowLeft" || event.key.toLowerCase() === "a") {
            leftPressed = true;
            event.preventDefault();
        }
        if (event.key === "ArrowRight" || event.key.toLowerCase() === "d") {
            rightPressed = true;
            event.preventDefault();
        }
    }

    function keyUp(event) {
        if (event.key === "ArrowLeft" || event.key.toLowerCase() === "a") leftPressed = false;
        if (event.key === "ArrowRight" || event.key.toLowerCase() === "d") rightPressed = false;
    }

    document.addEventListener("keydown", keyDown);
    document.addEventListener("keyup", keyUp);

    function smoothBasketMovement() {
        if (!miniGameRunning || currentMiniGame !== "tree") return;
        if (leftPressed) basketX -= 0.8;
        if (rightPressed) basketX += 0.8;
        if (basketX < 2) basketX = 2;
        if (basketX > 88) basketX = 88;
        basket.style.left = basketX + "%";
        requestAnimationFrame(smoothBasketMovement);
    }
    smoothBasketMovement();

    const seedSpawner = setInterval(function() {
        if (!miniGameRunning || currentMiniGame !== "tree") {
            clearInterval(seedSpawner);
            document.removeEventListener("keydown", keyDown);
            document.removeEventListener("keyup", keyUp);
            return;
        }

        const seed = document.createElement("div");
        seed.innerText = Math.random() < 0.15 ? "✨🌱" : "🌱";
        seed.style.position = "absolute";
        seed.style.left = (5 + Math.random() * 85) + "%";
        seed.style.top = "-35px";
        seed.style.fontSize = "25px";
        seed.style.pointerEvents = "none";
        area.appendChild(seed);

        let seedY = -35;
        const speed = 1.5 + buildings.tree * 0.35 + Math.random() * 1.5;

        const fall = setInterval(function() {
            if (!miniGameRunning || currentMiniGame !== "tree") {
                clearInterval(fall);
                if (seed.parentNode) seed.remove();
                return;
            }

            seedY += speed;
            seed.style.top = seedY + "px";

            const seedRect = seed.getBoundingClientRect();
            const basketRect = basket.getBoundingClientRect();

            if (seedRect.bottom >= basketRect.top && seedRect.left < basketRect.right && seedRect.right > basketRect.left) {
                clearInterval(fall);
                seed.remove();

                if (seed.innerText.includes("✨")) caught += 2;
                else caught++;

                miniScore = caught;
                document.getElementById("miniScore").innerText = miniScore;
                document.getElementById("miniGameMessage").innerText = seed.innerText.includes("✨") ? "✨ GOLDEN SEED! +2" : "🌱 Nice catch!";

                if (caught >= target) {
                    clearInterval(seedSpawner);
                    document.removeEventListener("keydown", keyDown);
                    document.removeEventListener("keyup", keyUp);
                    miniGameWin();
                }
                return;
            }

            if (seedY > area.clientHeight) {
                clearInterval(fall);
                seed.remove();
            }
        }, 30);
    }, 650);

    document.getElementById("miniGameMessage").innerText = "← → or A / D to move!";
}

function startSolarGame() {
    const title = document.getElementById("miniGameTitle");
    const description = document.getElementById("miniGameDescription");
    const area = document.getElementById("miniGameArea");

    title.innerText = "⚡ ENERGY RUSH";
    description.innerText = "Quick! Click the ⚡ energy symbols!";
    area.innerHTML = "";
    area.style.position = "relative";
    area.style.overflow = "hidden";

    const target = 10 + buildings.solar * 2;
    let score = 0;
    let running = true;
    let spawnInterval;

    document.getElementById("miniGameMessage").innerText = "Find the ⚡!";
    document.getElementById("miniScore").innerText = "0";

    function createEnergy() {
        if (!miniGameRunning || !running || currentMiniGame !== "solar") return;

        const object = document.createElement("button");
        const random = Math.random();
        let correct = false;

        if (random < 0.45) { object.innerText = "⚡"; correct = true; }
        else if (random < 0.65) { object.innerText = "☀️"; }
        else if (random < 0.82) { object.innerText = "☁️"; }
        else { object.innerText = "💧"; }

        object.style.position = "absolute";
        object.style.left = (5 + Math.random() * 85) + "%";
        object.style.top = (10 + Math.random() * 70) + "%";
        object.style.fontSize = "32px";
        object.style.background = "transparent";
        object.style.border = "none";
        object.style.cursor = "pointer";
        object.style.padding = "5px";
        object.style.zIndex = "20";

        object.onclick = function() {
            if (!miniGameRunning || !running) return;
            if (correct) {
                score++;
                document.getElementById("miniGameMessage").innerText = "⚡ GREAT! +1";
            } else {
                score = Math.max(0, score - 1);
                document.getElementById("miniGameMessage").innerText = "❌ Wrong symbol! -1";
            }
            document.getElementById("miniScore").innerText = score;
            object.remove();

            if (score >= target) {
                running = false;
                clearInterval(spawnInterval);
                document.getElementById("miniGameMessage").innerText = "🌞 SOLAR POWER MAXED!";
                setTimeout(() => miniGameWin(), 600);
            }
        };

        area.appendChild(object);
        setTimeout(() => { if (object.parentNode) object.remove(); }, 2200);
    }

    const speed = Math.max(1200 - buildings.solar * 80, 750);
    spawnInterval = setInterval(createEnergy, speed);
    createEnergy();
}

function startRecycleGame() {
    const title = document.getElementById("miniGameTitle");
    const description = document.getElementById("miniGameDescription");
    const area = document.getElementById("miniGameArea");

    title.innerText = "♻️ RECYCLE DASH!";
    description.innerText = "Sort the rubbish into the correct bins!";
    area.innerHTML = "";
    area.style.position = "relative";
    area.style.overflow = "hidden";

    const recycleBuildings = buildings.recycle || 0;
    const target = 8 + recycleBuildings * 2;
    let score = 0;
    let combo = 0;
    let selectedItem = null;
    let gameRunning = true;
    let spawnTimer;

    const comboDisplay = document.createElement("div");
    comboDisplay.innerText = "🔥 Combo: 0";
    comboDisplay.style.position = "absolute";
    comboDisplay.style.top = "5px";
    comboDisplay.style.left = "10px";
    comboDisplay.style.fontWeight = "bold";
    comboDisplay.style.color = "#f4e6a2";
    comboDisplay.style.zIndex = "100";
    area.appendChild(comboDisplay);

    const bins = document.createElement("div");
    bins.style.position = "absolute";
    bins.style.bottom = "5px";
    bins.style.left = "0";
    bins.style.width = "100%";
    bins.style.display = "flex";
    bins.style.justifyContent = "space-around";
    bins.style.alignItems = "flex-end";
    bins.style.zIndex = "50";

    const binData = [
        { type: "paper", icon: "📄", name: "PAPER" },
        { type: "plastic", icon: "🥤", name: "PLASTIC" },
        { type: "food", icon: "🍎", name: "FOOD" },
        { type: "electronic", icon: "🔋", name: "E-WASTE" }
    ];

    binData.forEach(function(data) {
        const bin = document.createElement("button");
        bin.innerHTML = data.icon + "<br>" + data.name;
        bin.dataset.type = data.type;
        bin.style.width = "72px";
        bin.style.height = "65px";
        bin.style.fontSize = "13px";
        bin.style.background = "#567c4f";
        bin.style.color = "white";
        bin.style.border = "3px solid #9fd28f";
        bin.style.borderRadius = "10px";
        bin.style.cursor = "pointer";
        bin.style.fontWeight = "bold";

        bin.onclick = function() {
            if (!selectedItem || !gameRunning) {
                document.getElementById("miniGameMessage").innerText = "👀 Pick up some rubbish first!";
                return;
            }

            if (selectedItem.type === data.type) {
                score++;
                combo++;
                document.getElementById("miniScore").innerText = score;
                comboDisplay.innerText = "🔥 Combo: " + combo;
                document.getElementById("miniGameMessage").innerText = combo >= 3 ? "🌟 AMAZING COMBO!" : "✅ Correct!";
                selectedItem.element.remove();
                selectedItem = null;

                if (score >= target) {
                    gameRunning = false;
                    clearInterval(spawnTimer);
                    document.getElementById("miniGameMessage").innerText = "🎉 TOWN CLEANED!";
                    setTimeout(() => miniGameWin(), 700);
                }
            } else {
                combo = 0;
                comboDisplay.innerText = "🔥 Combo: 0";
                document.getElementById("miniGameMessage").innerText = "❌ That's the wrong bin!";
            }
        };
        bins.appendChild(bin);
    });
    area.appendChild(bins);

    const rubbish = [
        { icon: "📰", type: "paper" },
        { icon: "📦", type: "paper" },
        { icon: "🥤", type: "plastic" },
        { icon: "🧴", type: "plastic" },
        { icon: "🍎", type: "food" },
        { icon: "🍌", type: "food" },
        { icon: "🔋", type: "electronic" },
        { icon: "📱", type: "electronic" }
    ];

    function spawnRubbish() {
        if (!gameRunning) return;
        const data = rubbish[Math.floor(Math.random() * rubbish.length)];
        const item = document.createElement("button");
        item.innerText = data.icon;
        item.style.position = "absolute";
        item.style.left = (5 + Math.random() * 85) + "%";
        item.style.top = (25 + Math.random() * 25) + "%";
        item.style.fontSize = "30px";
        item.style.background = "transparent";
        item.style.border = "none";
        item.style.cursor = "pointer";
        item.style.zIndex = "60";

        item.onclick = function() {
            if (selectedItem === item) {
                selectedItem = null;
                item.style.transform = "";
                return;
            }
            if (selectedItem) selectedItem.element.style.transform = "";
            selectedItem = { element: item, type: data.type };
            item.style.transform = "scale(1.3)";
            document.getElementById("miniGameMessage").innerText = "👉 Now choose the correct bin!";
        };
        area.appendChild(item);
        setTimeout(() => { if (item.parentNode && selectedItem?.element !== item) item.remove(); }, 4500);
    }

    spawnRubbish();
    spawnTimer = setInterval(spawnRubbish, 1300);
}

function startBikeGame() {
    const title = document.getElementById("miniGameTitle");
    const description = document.getElementById("miniGameDescription");
    const area = document.getElementById("miniGameArea");

    title.innerText = "🚲 ECO DELIVERY";
    description.innerText = "Collect 📦 and deliver them to 🏠!";
    area.innerHTML = "";

    let bikeX = 45;
    let score = 0;
    const target = 8;
    const speed = 2.5 + buildings.bike * 0.4;

    const bike = document.createElement("div");
    bike.innerText = "🚲";
    bike.style.position = "absolute";
    bike.style.left = bikeX + "%";
    bike.style.bottom = "10px";
    bike.style.fontSize = "40px";
    bike.style.width = "50px";
    bike.style.textAlign = "center";
    bike.style.zIndex = "10";
    area.appendChild(bike);

    let leftPressed = false;
    let rightPressed = false;

    function keyDown(event) {
        if (!miniGameRunning || currentMiniGame !== "bike") return;
        if (event.key === "ArrowLeft" || event.key.toLowerCase() === "a") { leftPressed = true; event.preventDefault(); }
        if (event.key === "ArrowRight" || event.key.toLowerCase() === "d") { rightPressed = true; event.preventDefault(); }
    }
    function keyUp(event) {
        if (event.key === "ArrowLeft" || event.key.toLowerCase() === "a") leftPressed = false;
        if (event.key === "ArrowRight" || event.key.toLowerCase() === "d") rightPressed = false;
    }

    document.addEventListener("keydown", keyDown);
    document.addEventListener("keyup", keyUp);

    function moveBike() {
        if (!miniGameRunning || currentMiniGame !== "bike") return;
        if (leftPressed) bikeX -= 0.8;
        if (rightPressed) bikeX += 0.8;
        if (bikeX < 5) bikeX = 5;
        if (bikeX > 85) bikeX = 85;
        bike.style.left = bikeX + "%";
        requestAnimationFrame(moveBike);
    }
    moveBike();

    const spawn = setInterval(function() {
        if (!miniGameRunning || currentMiniGame !== "bike") {
            clearInterval(spawn);
            document.removeEventListener("keydown", keyDown);
            document.removeEventListener("keyup", keyUp);
            return;
        }

        const object = document.createElement("div");
        const random = Math.random();

        if (random < 0.45) { object.innerText = "📦"; object.dataset.type = "package"; }
        else if (random < 0.65) { object.innerText = "🏠"; object.dataset.type = "house"; }
        else if (random < 0.85) { object.innerText = "🚗"; object.dataset.type = "car"; }
        else { object.innerText = "🌳"; object.dataset.type = "obstacle"; }

        object.style.position = "absolute";
        object.style.left = (5 + Math.random() * 85) + "%";
        object.style.top = "-40px";
        object.style.fontSize = "30px";
        object.style.width = "45px";
        object.style.zIndex = "5";
        area.appendChild(object);

        let objectY = -40;
        const fall = setInterval(function() {
            if (!miniGameRunning || currentMiniGame !== "bike") {
                clearInterval(fall);
                if (object.parentNode) object.remove();
                return;
            }
            objectY += speed;
            object.style.top = objectY + "px";

            const bikeRect = bike.getBoundingClientRect();
            const objectRect = object.getBoundingClientRect();

            if (bikeRect.left < objectRect.right && bikeRect.right > objectRect.left && bikeRect.top < objectRect.bottom && bikeRect.bottom > objectRect.top) {
                clearInterval(fall);
                object.remove();

                if (object.dataset.type === "package") {
                    document.getElementById("miniGameMessage").innerText = "📦 Package collected!";
                } else if (object.dataset.type === "house") {
                    score++;
                    miniScore = score;
                    document.getElementById("miniScore").innerText = score;
                    document.getElementById("miniGameMessage").innerText = "🏠 Delivery complete!";
                    if (score >= target) {
                        clearInterval(spawn);
                        document.removeEventListener("keydown", keyDown);
                        document.removeEventListener("keyup", keyUp);
                        miniGameWin();
                    }
                } else {
                    score = Math.max(0, score - 1);
                    miniScore = score;
                    document.getElementById("miniScore").innerText = score;
                }
            }

            if (objectY > area.clientHeight) {
                clearInterval(fall);
                object.remove();
            }
        }, 30);
    }, 800);
}

function startBusGame() {
    const title = document.getElementById("miniGameTitle");
    const description = document.getElementById("miniGameDescription");
    const area = document.getElementById("miniGameArea");

    title.innerText = "🚌 ECO BUS RACE";
    description.innerText = "Race through the city! Collect 🌱 and avoid 🚗!";
    area.innerHTML = "";
    area.style.background = "#333";
    area.style.overflow = "hidden";

    let busX = 42;
    let score = 0;
    let speed = 3 + buildings.bus * 0.5;
    const target = 10;

    for (let i = 0; i < 8; i++) {
        const line = document.createElement("div");
        line.className = "road-line";
        line.style.top = (i * 35) + "px";
        area.appendChild(line);
    }

    const bus = document.createElement("div");
    bus.className = "race-bus";
    bus.innerText = "🚌";
    bus.style.position = "absolute";
    bus.style.left = busX + "%";
    bus.style.bottom = "10px";
    bus.style.fontSize = "40px";
    bus.style.width = "50px";
    bus.style.zIndex = "10";
    area.appendChild(bus);

    let leftPressed = false;
    let rightPressed = false;

    function keyDown(event) {
        if (!miniGameRunning || currentMiniGame !== "bus") return;
        if (event.key === "ArrowLeft" || event.key.toLowerCase() === "a") { leftPressed = true; event.preventDefault(); }
        if (event.key === "ArrowRight" || event.key.toLowerCase() === "d") { rightPressed = true; event.preventDefault(); }
    }
    function keyUp(event) {
        if (event.key === "ArrowLeft" || event.key.toLowerCase() === "a") leftPressed = false;
        if (event.key === "ArrowRight" || event.key.toLowerCase() === "d") rightPressed = false;
    }

    document.addEventListener("keydown", keyDown);
    document.addEventListener("keyup", keyUp);

    function moveBus() {
        if (!miniGameRunning || currentMiniGame !== "bus") return;
        if (leftPressed) busX -= 0.8;
        if (rightPressed) busX += 0.8;
        if (busX < 5) busX = 5;
        if (busX > 85) busX = 85;
        bus.style.left = busX + "%";
        requestAnimationFrame(moveBus);
    }
    moveBus();

    const spawn = setInterval(function() {
        if (!miniGameRunning || currentMiniGame !== "bus") {
            clearInterval(spawn);
            document.removeEventListener("keydown", keyDown);
            document.removeEventListener("keyup", keyUp);
            return;
        }

        const object = document.createElement("div");
        const random = Math.random();

        if (random < 0.55) {
            object.innerText = Math.random() < 0.5 ? "🌱" : "🪙";
            object.dataset.good = "true";
        } else {
            object.innerText = "🚗";
            object.dataset.good = "false";
        }

        object.style.position = "absolute";
        object.style.left = (5 + Math.random() * 85) + "%";
        object.style.top = "-40px";
        object.style.fontSize = "30px";
        object.style.zIndex = "5";
        area.appendChild(object);

        let objectY = -40;
        const fall = setInterval(function() {
            if (!miniGameRunning || currentMiniGame !== "bus") {
                clearInterval(fall);
                if (object.parentNode) object.remove();
                return;
            }
            objectY += speed;
            object.style.top = objectY + "px";

            const busRect = bus.getBoundingClientRect();
            const objectRect = object.getBoundingClientRect();

            if (busRect.left < objectRect.right && busRect.right > objectRect.left && busRect.top < objectRect.bottom && busRect.bottom > objectRect.top) {
                clearInterval(fall);
                object.remove();

                if (object.dataset.good === "true") {
                    score++;
                    miniScore = score;
                    document.getElementById("miniScore").innerText = score;
                    if (score >= target) {
                        clearInterval(spawn);
                        document.removeEventListener("keydown", keyDown);
                        document.removeEventListener("keyup", keyUp);
                        miniGameWin();
                    }
                } else {
                    score = Math.max(0, score - 1);
                    miniScore = score;
                    document.getElementById("miniScore").innerText = score;
                }
            }

            if (objectY > area.clientHeight) {
                clearInterval(fall);
                object.remove();
            }
        }, 30);
    }, 700);
}

function startHouseGame() {
    const title = document.getElementById("miniGameTitle");
    const description = document.getElementById("miniGameDescription");
    const area = document.getElementById("miniGameArea");

    title.innerText = "🏠 ENERGY SAVER";
    description.innerText = "Quick! Turn off appliances wasting energy!";
    area.innerHTML = "";

    let score = 0;
    const target = 8;
    const appliances = [
        { icon: "💡", name: "Light", waste: true },
        { icon: "📺", name: "TV", waste: true },
        { icon: "💻", name: "Computer", waste: true },
        { icon: "🎮", name: "Game Console", waste: true },
        { icon: "❄️", name: "Air Conditioner", waste: false },
        { icon: "🧊", name: "Refrigerator", waste: false },
        { icon: "🚿", name: "Shower", waste: false }
    ];

    let gameActive = true;

    function showAppliance() {
        if (!miniGameRunning || currentMiniGame !== "house") {
            gameActive = false;
            return;
        }

        area.innerHTML = "";
        const appliance = appliances[Math.floor(Math.random() * appliances.length)];
        const item = document.createElement("button");
        item.innerText = appliance.icon;
        item.style.position = "absolute";
        item.style.left = (10 + Math.random() * 75) + "%";
        item.style.top = (10 + Math.random() * 55) + "%";
        item.style.fontSize = "50px";
        item.style.background = "transparent";
        item.style.border = "none";
        item.style.cursor = "pointer";
        area.appendChild(item);

        item.onclick = function() {
            if (!gameActive) return;
            if (appliance.waste) {
                score++;
                miniScore = score;
                document.getElementById("miniScore").innerText = score;
                if (score >= target) {
                    gameActive = false;
                    miniGameWin();
                    return;
                }
                setTimeout(showAppliance, 300);
            } else {
                score = Math.max(0, score - 1);
                miniScore = score;
                document.getElementById("miniScore").innerText = score;
                setTimeout(showAppliance, 500);
            }
        };

        const disappearTime = Math.max(8000, 10000 - buildings.house * 200);
        setTimeout(() => {
            if (!gameActive || !miniGameRunning) return;
            if (area.contains(item)) item.remove();
            showAppliance();
        }, disappearTime);
    }
    showAppliance();
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

/* =========================================================
   INITIALIZE
========================================================= */
updateBars();
updateCoins();
updatePopulation();
updateWildlife();
changeWeather();