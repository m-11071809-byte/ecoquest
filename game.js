let coins = 150, population = 10, level = 1;
let stats = { air: 20, energy: 20, waste: 20, happy: 20, nature: 20 };
let buildings = { tree: 0, solar: 0, recycle: 0, bike: 0, bus: 0, house: 0 };
let costs = { tree: 10, solar: 20, recycle: 25, bike: 15, bus: 30, house: 35 };
let currentMiniGame = null, miniTimer = 15, miniScore = 0, miniInterval = null, miniGameRunning = false;

function build(type) {
    if (buildings[type] >= 4) { showMessage("MAX LEVEL REACHED!"); return; }
    if (coins < costs[type]) { showMessage("NOT ENOUGH COINS!"); return; }
    startMiniGame(type);
}

function updateBars() {
    for (let key in stats) {
        let bar = document.getElementById(key);
        let text = document.getElementById(key + "Text");
        if (bar) bar.style.width = stats[key] + "%";
        if (text) text.innerText = stats[key] + "%";
    }
}

function updateCoins() { document.getElementById("coins").innerText = coins; }
function showMessage(text) { document.getElementById("message").innerText = text; }

function showPopup(title, text) {
    document.getElementById("popupTitle").innerText = title;
    document.getElementById("popupText").innerText = text;
    document.getElementById("popup").style.display = "block";
}
function closePopup() { document.getElementById("popup").style.display = "none"; }

function startMiniGame(type) {
    currentMiniGame = type;
    miniScore = 0;
    miniTimer = 15;
    miniGameRunning = true;
    document.getElementById("minigameOverlay").style.display = "flex";
    document.getElementById("miniScore").innerText = "0";
    document.getElementById("miniTimer").innerText = miniTimer;
    document.getElementById("miniGameMessage").innerText = "";

    let area = document.getElementById("miniGameArea");
    area.innerHTML = "";

    let spawner = setInterval(() => {
        if (!miniGameRunning) { clearInterval(spawner); return; }
        let seed = document.createElement("button");
        seed.innerText = "🌱";
        seed.style.position = "absolute";
        seed.style.left = (Math.random() * 80) + "%";
        seed.style.top = (Math.random() * 70) + "%";
        seed.style.fontSize = "24px";
        seed.onclick = () => {
            miniScore++;
            document.getElementById("miniScore").innerText = miniScore;
            seed.remove();
            if (miniScore >= 5) {
                clearInterval(spawner);
                miniGameWin();
            }
        };
        area.appendChild(seed);
        setTimeout(() => { if (seed.parentNode) seed.remove(); }, 1200);
    }, 700);

    clearInterval(miniInterval);
    miniInterval = setInterval(() => {
        miniTimer--;
        document.getElementById("miniTimer").innerText = miniTimer;
        if (miniTimer <= 0) {
            clearInterval(spawner);
            clearInterval(miniInterval);
            miniGameLose();
        }
    }, 1000);
}

function miniGameWin() {
    miniGameRunning = false;
    clearInterval(miniInterval);
    let type = currentMiniGame;
    coins = coins - costs[type] + 25;
    buildings[type]++;
    stats.air += 5; stats.nature += 5;
    updateBars();
    updateCoins();
    document.getElementById(type + "Level").innerText = buildings[type];
    if(type === 'house') document.getElementById("houseLevel2").innerText = buildings.house;
    
    document.getElementById("minigameOverlay").style.display = "none";
    showMessage(type.toUpperCase() + " Upgraded!");
    
    if (buildings.tree >= 3) {
        showPopup("QUEST COMPLETED", "You planted 3 trees! +50 Coins");
        coins += 50;
        updateCoins();
    }
}

function miniGameLose() {
    miniGameRunning = false;
    clearInterval(miniInterval);
    document.getElementById("minigameOverlay").style.display = "none";
    showMessage("Mini-game failed. Try again!");
}

updateBars();
updateCoins();
