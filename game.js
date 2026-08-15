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

    tree: [
        "🌱",
        "🌿",
        "🌳",
        "🌲"
    ],

    solar: [
        "🔆",
        "☀️",
        "🌞",
        "⚡"
    ],

    recycle: [
        "🗑️",
        "♻️",
        "🔄",
        "♻️"
    ],

    bike: [
        "🚲",
        "🚴",
        "🚴‍♀️",
        "🚵"
    ],

    bus: [
        "🚏",
        "🚌",
        "🚍",
        "🚎"
    ],

    house: [
        "🛖",
        "🏠",
        "🏡",
        "🏘️"
    ]

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

    /* Check that feature exists */

    if (!buildings.hasOwnProperty(type)) {

        return;

    }


    /* MAX LEVEL */

    if (buildings[type] >= 4) {

        showMessage(
            type.toUpperCase()
            + " has reached MAX LEVEL!"
        );

        return;

    }


    /* NOT ENOUGH COINS */

    const cost = costs[type];

    if (coins < cost) {

        showMessage(
            "NOT ENOUGH ECO COINS!"
        );

        return;

    }


    /*
       Don't upgrade yet!

       The player must complete
       the mini-game first.
    */

    startMiniGame(type);

}


/* =========================================================
   FEATURE ICON UPDATE
========================================================= */

function updateFeatureIcon(type) {

    const levelIndex =
        buildings[type] - 1;


    if (
        !featureIcons[type] ||
        levelIndex < 0
    ) {

        return;

    }


    const icon =
        featureIcons[type][levelIndex];


    /*
       Try common IDs first.
    */

    const possibleIDs = [

        type,

        type + "Icon",

        type + "-icon",

        type + "Feature"

    ];


    for (
        let i = 0;
        i < possibleIDs.length;
        i++
    ) {

        const element =
            document.getElementById(
                possibleIDs[i]
            );


        if (element) {

            element.innerText =
                icon;

            return;

        }

    }


    /*
       If the feature is a button,
       search for data-feature.
    */

    const feature =
        document.querySelector(
            '[data-feature="' + type + '"]'
        );


    if (feature) {

        feature.innerText =
            icon;

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


    for (
        let key in stats
    ) {

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

    population =
        10 +
        buildings.house * 5;


    const element =
        document.getElementById(
            "population"
        );


    if (element) {

        element.innerText =
            population;

    }

}

/* =========================================================
   LEVEL
========================================================= */

function checkLevel() {

    const average =
        (
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


    if (newLevel > level) {

        level = newLevel;

        const levelElement = document.getElementById("level");
        if (levelElement) {
            levelElement.innerText = level;
        }

        coins += 50;

        updateCoins();

        showPopup(
            "LEVEL UP!",
            "Your eco town reached LEVEL "
            + level
            + "! +50 ECO COINS!"
        );
    }
}


/* =========================================================
   ADD ONE FEATURE TO MAP
========================================================= */

function addFeatureToMap(type) {

    const map =
        document.getElementById("worldMap");

    if (!map) return;


    /* Create feature */

    const feature =
        document.createElement("div");

    feature.className =
        "building " + type;


    /* =====================================================
       ICONS
    ===================================================== */

    const icons = {

        tree: "🌳",

        solar: "☀️",

        recycle: "♻️",

        bike: "🚲",

        bus: "🚌",

        house: "🏠"

    };


    /* =====================================================
       LABELS
    ===================================================== */

    const names = {

        tree: "TREE",

        solar: "SOLAR",

        recycle: "RECYCLE",

        bike: "BIKE",

        bus: "BUS",

        house: "HOUSE"

    };


    /* =====================================================
       CONTENT
    ===================================================== */

    feature.innerHTML =

        "<div class='feature-icon'>"
        + icons[type]
        + "</div>"

        +

        "<span>"
        + names[type]
        + "</span>";


    /* =====================================================
       RANDOM POSITION
    ===================================================== */

    feature.style.left =
        (5 + Math.random() * 85) + "%";

    feature.style.top =
        (8 + Math.random() * 80) + "%";


    feature.style.zIndex = "20";


    /* =====================================================
       CLICK
    ===================================================== */

    feature.onclick =
        function() {

            build(type);

        };


    /* =====================================================
       ADD TO MAP
    ===================================================== */

    map.appendChild(feature);
}


/* =========================================================
   BARS
========================================================= */

function updateBars() {

    const names = [

        "air",

        "energy",

        "waste",

        "happy",

        "nature"

    ];


    names.forEach(
        function(name) {

            const bar =
                document.getElementById(
                    name
                );


            const text =
                document.getElementById(
                    name + "Text"
                );


            if (bar) {

                bar.style.width =
                    stats[name] + "%";

            }


            if (text) {

                text.innerText =
                    stats[name] + "%";

            }

        }
    );

}


/* =========================================================
   COINS
========================================================= */

function updateCoins() {

    const element =
        document.getElementById(
            "coins"
        );


    if (element) {

        element.innerText =
            coins;

    }

}


/* =========================================================
   MESSAGE
========================================================= */

function showMessage(text) {

    const element =
        document.getElementById(
            "message"
        );


    if (element) {

        element.innerText =
            text;

    }

}


/* =========================================================
   POPUP
========================================================= */

function showPopup(title, text) {

    const titleElement =
        document.getElementById(
            "popupTitle"
        );


    const textElement =
        document.getElementById(
            "popupText"
        );


    const popup =
        document.getElementById(
            "popup"
        );


    if (titleElement) {

        titleElement.innerText =
            title;

    }


    if (textElement) {

        textElement.innerText =
            text;

    }


    if (popup) {

        popup.style.display =
            "block";

    }

}


function closePopup() {

    const popup =
        document.getElementById(
            "popup"
        );


    if (popup) {

        popup.style.display =
            "none";

    }

}


/* =========================================================
   MISSION
========================================================= */

let missionComplete = false;


function checkMission() {

    if (
        buildings.tree >= 3 &&
        !missionComplete
    ) {

        missionComplete = true;

        coins += 50;

        updateCoins();


        const mission =
            document.getElementById(
                "mission"
            );


        if (mission) {

            mission.innerText =
                "QUEST COMPLETE!";

        }


        showPopup(

            "QUEST COMPLETE!",

            "You planted 3 trees! +50 ECO COINS!"

        );

    }

}


/* =========================================================
   NPC DATA
========================================================= */

const npcData = {

    npc1: {

        element:
            document.getElementById(
                "npc1"
            ),

        speech:
            document.getElementById(
                "speech1"
            ),

        name:
            "ALEX",

        personality:
            "cycling"

    },


    npc2: {

        element:
            document.getElementById(
                "npc2"
            ),

        speech:
            document.getElementById(
                "speech2"
            ),

        name:
            "MIA",

        personality:
            "recycling"

    },


    npc3: {

        element:
            document.getElementById(
                "npc3"
            ),

        speech:
            document.getElementById(
                "speech3"
            ),

        name:
            "LEO",

        personality:
            "nature"

    }

};


/* =========================================================
   NPC ACTIVITIES
========================================================= */

const activities = {

    tree: {

        message:
            "The trees make this town beautiful!",

        x: 13,

        y: 18

    },


    solar: {

        message:
            "Clean energy is the future!",

        x: 82,

        y: 18

    },


    recycle: {

        message:
            "Time to recycle!",

        x: 13,

        y: 70

    },


    bike: {

        message:
            "Let's go cycling!",

        x: 80,

        y: 70

    },


    bus: {

        message:
            "The bus is coming!",

        x: 58,

        y: 28

    },


    house: {

        message:
            "This is a nice place to live!",

        x: 20,

        y: 30

    }

};


/* =========================================================
   NPC SPEAK
========================================================= */

function npcSpeak(
    npcID,
    text
) {

    const npc =
        npcData[npcID];


    if (
        !npc ||
        !npc.speech
    ) {

        return;

    }


    npc.speech.innerText =
        npc.name
        + ": "
        + text;


    npc.speech.style.display =
        "block";


    setTimeout(
        function() {

            npc.speech.style.display =
                "none";

        },
        4500
    );

}


/* =========================================================
   NPC MOVE
========================================================= */

function moveNPC(
    npcID,
    type
) {

    const npc =
        npcData[npcID];


    const activity =
        activities[type];


    if (
        !npc ||
        !npc.element ||
        !activity
    ) {

        return;

    }


    npc.element.style.left =
        activity.x + "%";


    npc.element.style.top =
        activity.y + "%";


    setTimeout(
        function() {

            npcSpeak(
                npcID,
                activity.message
            );

        },
        6000
    );

}


/* =========================================================
   NPC CHOICE
========================================================= */

function npcChooseActivity(
    npcID
) {

    const npc =
        npcData[npcID];


    if (!npc)
        return;


    let preferred = [];


    if (
        npc.personality ===
        "cycling"
    ) {

        if (
            buildings.bike > 0
        )
            preferred.push(
                "bike"
            );


        if (
            buildings.bus > 0
        )
            preferred.push(
                "bus"
            );

    }


    if (
        npc.personality ===
        "recycling"
    ) {

        if (
            buildings.recycle > 0
        )
            preferred.push(
                "recycle"
            );

    }


    if (
        npc.personality ===
        "nature"
    ) {

        if (
            buildings.tree > 0
        )
            preferred.push(
                "tree"
            );

    }


    if (
        preferred.length === 0
    ) {

        for (
            let type in buildings
        ) {

            if (
                buildings[type] > 0 &&
                activities[type]
            ) {

                preferred.push(
                    type
                );

            }

        }

    }


    if (
        preferred.length === 0
    ) {

        npcSpeak(

            npcID,

            "The town needs more facilities!"

        );

        return;

    }


    const choice =

        preferred[
            Math.floor(
                Math.random()
                * preferred.length
            )
        ];


    moveNPC(
        npcID,
        choice
    );

}


/* =========================================================
   NPC ROUTINE
========================================================= */

function startNPC(
    npcID
) {

    setInterval(
        function() {

            npcChooseActivity(
                npcID
            );

        },
        12000
    );

}


startNPC("npc1");

startNPC("npc2");

startNPC("npc3");


/* =========================================================
   NPC CLICK
========================================================= */

const npc1 =
    document.getElementById(
        "npc1"
    );


if (npc1) {

    npc1.addEventListener(
        "click",
        function() {

            npcSpeak(
                "npc1",
                "I love cycling around town!"
            );

        }
    );

}


const npc2 =
    document.getElementById(
        "npc2"
    );


if (npc2) {

    npc2.addEventListener(
        "click",
        function() {

            npcSpeak(
                "npc2",
                "Remember to recycle!"
            );

        }
    );

}


const npc3 =
    document.getElementById(
        "npc3"
    );


if (npc3) {

    npc3.addEventListener(
        "click",
        function() {

            npcSpeak(
                "npc3",
                "Look at those trees!"
            );

        }
    );

}


/* =========================================================
   WEATHER
========================================================= */

const weatherTypes = [

    "sunny",

    "rainy",

    "cloudy"

];


function changeWeather() {

    const type =

        weatherTypes[
            Math.floor(
                Math.random()
                * weatherTypes.length
            )
        ];


    const city =
        document.getElementById(
            "city"
        );


    const weather =
        document.getElementById(
            "weather"
        );


    const sun =
        document.querySelector(
            ".sun"
        );


    const clouds =
        document.querySelectorAll(
            ".cloud"
        );


    const rain =
        document.querySelector(
            ".rain"
        );


    const rainbow =
        document.querySelector(
            ".rainbow"
        );


    if (city) {

        city.style.backgroundColor =
            "#6fa84b";

    }


    if (sun)
        sun.style.display =
            "none";


    if (rain)
        rain.style.display =
            "none";


    if (rainbow)
        rainbow.style.display =
            "none";


    clouds.forEach(
        function(cloud) {

            cloud.style.display =
                "none";

        }
    );


    if (
        type === "sunny"
    ) {

        if (weather)
            weather.innerText =
                " SUNNY";


        if (sun)
            sun.style.display =
                "block";

    }


    if (
        type === "rainy"
    ) {

        if (weather)
            weather.innerText =
                "🌧️ RAINY";


        if (city)
            city.style.backgroundColor =
                "#638c86";


        if (rain)
            rain.style.display =
                "block";


        clouds.forEach(
            function(cloud) {

                cloud.style.display =
                    "block";

            }
        );

    }


    if (
        type === "cloudy"
    ) {

        if (weather)
            weather.innerText =
                "☁️ CLOUDY";


        if (city)
            city.style.backgroundColor =
                "#789c86";


        clouds.forEach(
            function(cloud) {

                cloud.style.display =
                    "block";

            }
        );

    }



}


setInterval(changeWeather, 20000);

/* =========================================================
   DAY / NIGHT CYCLE
========================================================= */

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

/* Change between day and night every 60 seconds */

setInterval(changeTime, 60000);


/* =========================================================
   WILDLIFE
========================================================= */

function updateWildlife() {

    const bird =
        document.getElementById(
            "bird"
        );


    const butterfly =
        document.getElementById(
            "butterfly"
        );


    const squirrel =
        document.getElementById(
            "squirrel"
        );


    if (bird) {

        bird.style.display =

            stats.nature >= 30
            ? "block"
            : "none";

    }


    if (butterfly) {

        butterfly.style.display =

            stats.nature >= 50
            ? "block"
            : "none";

    }


    if (squirrel) {

        squirrel.style.display =

            stats.nature >= 70
            ? "block"
            : "none";

    }

}


/* =========================================================
   REAL LIFE CHALLENGES
========================================================= */

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


    showPopup(

        "REAL WORLD QUEST!",

        "Great job helping the environment! +20 ECO COINS!"

    );


    const next =

        challenges[
            Math.floor(
                Math.random()
                * challenges.length
            )
        ];


    const challengeText =
        document.getElementById(
            "challengeText"
        );


    if (challengeText) {

        challengeText.innerText =
            next;

    }

}


/* =========================================================
   CITY EVENTS
========================================================= */

const events = [

    "Volunteers planted trees!",

    "Citizens organized a recycling day!",

    "More people are cycling today!",

    "The park received new plants!",

    "A clean-up event happened near the road!"

];


function randomEvent() {

    const event =

        events[
            Math.floor(
                Math.random()
                * events.length
            )
        ];


    const eventText =
        document.getElementById(
            "eventText"
        );


    if (eventText) {

        eventText.innerText =
            event;

    }


    if (
        event.includes(
            "trees"
        )
    ) {

        stats.nature += 4;

    }


    if (
        event.includes(
            "recycling"
        )
    ) {

        stats.waste += 3;

    }


    if (
        event.includes(
            "cycling"
        )
    ) {

        stats.air += 3;

    }


    for (
        let key in stats
    ) {

        if (
            stats[key] > 100
        ) {

            stats[key] = 100;

        }

    }


    updateBars();

    updateWildlife();

}


setInterval(
    randomEvent,
    20000
);


/* =========================================================
   MINI GAME SYSTEM
========================================================= */

function startMiniGame(type) {

    currentMiniGame = type;

    miniScore = 0;

    miniTimer = 30;

    miniGameRunning = true;


    const overlay =
        document.getElementById(
            "minigameOverlay"
        );


    if (!overlay) {

        console.error(
            "Mini-game HTML not found!"
        );

        miniGameRunning = false;

        return;

    }


    overlay.style.display =
        "flex";


    document.getElementById(
        "miniScore"
    ).innerText =
        "0";


    document.getElementById(
        "miniTimer"
    ).innerText =
        "30";


    document.getElementById(
        "miniGameMessage"
    ).innerText =
        "30";


    /*
       Select mini-game
    */

    if (type === "tree") {

        startTreeGame();

    }

    else if (type === "solar") {

        startSolarGame();

    }

    else if (type === "recycle") {

        startRecycleGame();

    }

    else if (type === "bike") {

        startBikeGame();

    }

    else if (type === "bus") {

        startBusGame();

    }

    else if (type === "house") {

        startHouseGame();

    }



}



/* =========================================================
   🌳 TREE GAME
   CATCH THE FALLING SEEDS
========================================================= */

function startTreeGame() {

    const title =
        document.getElementById("miniGameTitle");

    const description =
        document.getElementById("miniGameDescription");

    const area =
        document.getElementById("miniGameArea");


    title.innerText =
        "🌳 SEED CATCHER";

    description.innerText =
        "Move the basket and catch the falling seeds!";


    area.innerHTML = "";


    /* =========================
       GAME SETTINGS
    ========================= */

    let basketX = 42;

    let caught = 0;

    const target = 10;


    /* =========================
       BASKET
    ========================= */

    const basket =
        document.createElement("div");

    basket.className =
        "seed-basket";

    basket.innerText =
        "🧺";


    basket.style.position =
        "absolute";

    basket.style.bottom =
        "8px";

    basket.style.left =
        basketX + "%";

    basket.style.fontSize =
        "42px";

    basket.style.width =
        "55px";

    basket.style.textAlign =
        "center";

    basket.style.transition =
        "left 0.08s linear";


    area.appendChild(basket);


    /* =========================
       MOVE BASKET
    ========================= */

   function moveBasket(event) {

    if (
        !miniGameRunning ||
        currentMiniGame !== "tree"
    ) {
        return;
    }

    if (
        event.key === "ArrowLeft" ||
        event.key.toLowerCase() === "a"
    ) {

        basketX -= 3;

    }

    if (
        event.key === "ArrowRight" ||
        event.key.toLowerCase() === "d"
    ) {

        basketX += 3;

    }

    if (basketX < 2) {
        basketX = 2;
    }

    if (basketX > 88) {
        basketX = 88;
    }

    basket.style.left =
        basketX + "%";

}

    let leftPressed = false;
let rightPressed = false;


function keyDown(event) {

    if (
        event.key === "ArrowLeft" ||
        event.key.toLowerCase() === "a"
    ) {

        leftPressed = true;

        event.preventDefault();

    }


    if (
        event.key === "ArrowRight" ||
        event.key.toLowerCase() === "d"
    ) {

        rightPressed = true;

        event.preventDefault();

    }

}


function keyUp(event) {

    if (
        event.key === "ArrowLeft" ||
        event.key.toLowerCase() === "a"
    ) {

        leftPressed = false;

    }


    if (
        event.key === "ArrowRight" ||
        event.key.toLowerCase() === "d"
    ) {

        rightPressed = false;

    }

}


document.addEventListener(
    "keydown",
    keyDown
);

document.addEventListener(
    "keyup",
    keyUp
);


/* Smooth movement */

function smoothBasketMovement() {

    if (
        !miniGameRunning ||
        currentMiniGame !== "tree"
    ) {
        return;
    }


    if (leftPressed) {

        basketX -= 0.8;

    }


    if (rightPressed) {

        basketX += 0.8;

    }


    if (basketX < 2) {

        basketX = 2;

    }


    if (basketX > 88) {

        basketX = 88;

    }


    basket.style.left =
        basketX + "%";


    requestAnimationFrame(
        smoothBasketMovement
    );

}


smoothBasketMovement();

    /* =========================
       SPAWN SEEDS
    ========================= */

    const seedSpawner =
        setInterval(function() {

            if (
                !miniGameRunning ||
                currentMiniGame !== "tree"
            ) {

                clearInterval(
                    seedSpawner
                );

                document.removeEventListener(
                    "keydown",
                    moveBasket
                );

                return;
            }


            const seed =
                document.createElement("div");


            seed.innerText =
                Math.random() < 0.15
                ? "✨🌱"
                : "🌱";


            seed.style.position =
                "absolute";


            seed.style.left =
                (5 + Math.random() * 85)
                + "%";


            seed.style.top =
                "-35px";


            seed.style.fontSize =
                "25px";


            seed.style.pointerEvents =
                "none";


            area.appendChild(seed);


            /* =========================
               FALL SPEED
            ========================= */

            let seedY = -35;


            const speed =
                1.5 +
                buildings.tree * 0.35 +
                Math.random() * 1.5;


            const fall =
                setInterval(function() {

                    if (
                        !miniGameRunning ||
                        currentMiniGame !== "tree"
                    ) {

                        clearInterval(fall);

                        if (
                            seed.parentNode
                        ) {
                            seed.remove();
                        }

                        return;
                    }


                    seedY += speed;


                    seed.style.top =
                        seedY + "px";


                    /* =====================
                       COLLISION
                    ===================== */

                    const seedRect =
                        seed.getBoundingClientRect();

                    const basketRect =
                        basket.getBoundingClientRect();


                    if (

                        seedRect.bottom >=
                        basketRect.top &&

                        seedRect.left <
                        basketRect.right &&

                        seedRect.right >
                        basketRect.left

                    ) {

                        clearInterval(fall);

                        seed.remove();


                        /* Golden seed */

                        if (
                            seed.innerText
                            .includes("✨")
                        ) {

                            caught += 2;

                        }

                        else {

                            caught++;

                        }


                        miniScore =
                            caught;


                        document.getElementById(
                            "miniScore"
                        ).innerText =
                            miniScore;


                        document.getElementById(
                            "miniGameMessage"
                        ).innerText =
                            seed.innerText.includes("✨")
                            ? "✨ GOLDEN SEED! +2"
                            : "🌱 Nice catch!";


                        if (
                            caught >= target
                        ) {

                            clearInterval(
                                seedSpawner
                            );

                            document.removeEventListener(
                                "keydown",
                                moveBasket
                            );


                            miniGameWin();

                        }

                        return;

                    }


                    /* =====================
                       MISSED SEED
                    ===================== */

                    if (
                        seedY >
                        area.clientHeight
                    ) {

                        clearInterval(fall);

                        seed.remove();

                    }

                }, 30);


        }, 650);


    /* =========================
       START MESSAGE
    ========================= */

    document.getElementById(
        "miniGameMessage"
    ).innerText =
        "← → or A / D to move!";

}

/* =========================================================
   ⚡ SOLAR ENERGY RUSH
========================================================= */

function startSolarGame() {

    const title =
        document.getElementById("miniGameTitle");

    const description =
        document.getElementById("miniGameDescription");

    const area =
        document.getElementById("miniGameArea");


    title.innerText =
        "⚡ ENERGY RUSH";

    description.innerText =
        "Quick! Click the ⚡ energy symbols!";


    area.innerHTML = "";

    area.style.position = "relative";
    area.style.overflow = "hidden";


    /* =====================================================
       SETTINGS
    ===================================================== */

    const target =
        10 + buildings.solar * 2;

    let score = 0;

    let running = true;

    let spawnInterval;


    /* =====================================================
       START MESSAGE
    ===================================================== */

    document.getElementById(
        "miniGameMessage"
    ).innerText =
        "Find the ⚡!";


    document.getElementById(
        "miniScore"
    ).innerText =
        "0";


    /* =====================================================
       CREATE ENERGY SYMBOL
    ===================================================== */

    function createEnergy() {

        if (
            !miniGameRunning ||
            !running ||
            currentMiniGame !== "solar"
        ) {

            return;

        }


        const object =
            document.createElement("button");


        const random =
            Math.random();


        let correct = false;


        /* =================================================
           SYMBOL TYPES
        ================================================= */

        if (
            random < 0.45
        ) {

            object.innerText =
                "⚡";

            correct = true;

        }

        else if (
            random < 0.65
        ) {

            object.innerText =
                "☀️";

        }

        else if (
            random < 0.82
        ) {

            object.innerText =
                "☁️";

        }

        else {

            object.innerText =
                "💧";

        }


        /* =================================================
           POSITION
        ================================================= */

        object.style.position =
            "absolute";


        object.style.left =
            (5 + Math.random() * 85)
            + "%";


        object.style.top =
            (10 + Math.random() * 70)
            + "%";


        object.style.fontSize =
            "32px";


        object.style.background =
            "transparent";


        object.style.border =
            "none";


        object.style.cursor =
            "pointer";


        object.style.padding =
            "5px";


        object.style.zIndex =
            "20";


        object.style.transition =
            "transform 0.1s";


        /* =================================================
           CLICK
        ================================================= */

        object.onclick =
            function() {

                if (
                    !miniGameRunning ||
                    !running
                ) {

                    return;

                }


                if (
                    correct
                ) {

                    score++;


                    document.getElementById(
                        "miniGameMessage"
                    ).innerText =
                        "⚡ GREAT! +1";


                }

                else {

                    score =
                        Math.max(
                            0,
                            score - 1
                        );


                    document.getElementById(
                        "miniGameMessage"
                    ).innerText =
                        "❌ Wrong symbol! -1";

                }


                document.getElementById(
                    "miniScore"
                ).innerText =
                    score;


                object.remove();


                /* ==============================
                   WIN
                ============================== */

                if (
                    score >= target
                ) {

                    running = false;


                    clearInterval(
                        spawnInterval
                    );


                    document.getElementById(
                        "miniGameMessage"
                    ).innerText =
                        "🌞 SOLAR POWER MAXED!";


                    setTimeout(
                        function() {

                            miniGameWin();

                        },
                        600
                    );

                }

            };


        area.appendChild(
            object
        );


        /* =================================================
           AUTOMATICALLY REMOVE AFTER A WHILE
        ================================================= */

        setTimeout(
            function() {

                if (
                    object &&
                    object.parentNode
                ) {

                    object.remove();

                }

            },
            2200
        );

    }


    /* =====================================================
       SPAWN OBJECTS
    ===================================================== */

    const speed =
        Math.max(
            1200 -
            buildings.solar * 80,
            750
        );


    spawnInterval =
        setInterval(
            createEnergy,
            speed
        );


    /* Create first symbol immediately */

    createEnergy();

}

/* =========================================================
   ♻️ RECYCLE DASH
========================================================= */

function startRecycleGame() {

    const title =
        document.getElementById("miniGameTitle");

    const description =
        document.getElementById("miniGameDescription");

    const area =
        document.getElementById("miniGameArea");


    title.innerText =
        "♻️ RECYCLE DASH!";

    description.innerText =
        "Sort the rubbish into the correct bins!";


    area.innerHTML = "";

    area.style.position =
        "relative";

    area.style.overflow =
        "hidden";


    /* =====================================================
       GAME SETTINGS
    ===================================================== */

    const recycleBuildings =
    buildings.recycle || 0;

const target =
    8 + recycleBuildings * 2;

    let score = 0;

    let combo = 0;

    let selectedItem = null;

    let gameRunning = true;

    let spawnTimer;


    /* =====================================================
       TOP INFO
    ===================================================== */

    const comboDisplay =
        document.createElement("div");


    comboDisplay.innerText =
        "🔥 Combo: 0";


    comboDisplay.style.position =
        "absolute";

    comboDisplay.style.top =
        "5px";

    comboDisplay.style.left =
        "10px";

    comboDisplay.style.fontWeight =
        "bold";

    comboDisplay.style.color =
        "#f4e6a2";

    comboDisplay.style.zIndex =
        "100";


    area.appendChild(
        comboDisplay
    );


    /* =====================================================
       BINS
    ===================================================== */

    const bins =
        document.createElement("div");


    bins.style.position =
        "absolute";

    bins.style.bottom =
        "5px";

    bins.style.left =
        "0";

    bins.style.width =
        "100%";

    bins.style.display =
        "flex";

    bins.style.justifyContent =
        "space-around";

    bins.style.alignItems =
        "flex-end";

    bins.style.zIndex =
        "50";


    const binData = [

        {
            type: "paper",
            icon: "📄",
            name: "PAPER"
        },

        {
            type: "plastic",
            icon: "🥤",
            name: "PLASTIC"
        },

        {
            type: "food",
            icon: "🍎",
            name: "FOOD"
        },

        {
            type: "electronic",
            icon: "🔋",
            name: "E-WASTE"
        }

    ];


    binData.forEach(
        function(data) {

            const bin =
                document.createElement(
                    "button"
                );


            bin.innerHTML =
                data.icon
                + "<br>"
                + data.name;


            bin.dataset.type =
                data.type;


            bin.style.width =
                "72px";

            bin.style.height =
                "65px";

            bin.style.fontSize =
                "13px";

            bin.style.background =
                "#567c4f";

            bin.style.color =
                "white";

            bin.style.border =
                "3px solid #9fd28f";

            bin.style.borderRadius =
                "10px";

            bin.style.cursor =
                "pointer";

            bin.style.fontWeight =
                "bold";


            /* =================================================
               BIN CLICK
            ================================================= */

            bin.onclick =
                function() {

                    if (
                        !selectedItem ||
                        !gameRunning
                    ) {

                        document.getElementById(
                            "miniGameMessage"
                        ).innerText =
                            "👀 Pick up some rubbish first!";

                        return;

                    }


                    if (
                        selectedItem.type ===
                        data.type
                    ) {

                        /* ===============================
                           CORRECT
                        =============================== */

                        score++;

                        combo++;


                        document.getElementById(
                            "miniScore"
                        ).innerText =
                            score;


                        comboDisplay.innerText =
                            "🔥 Combo: "
                            + combo;


                        document.getElementById(
                            "miniGameMessage"
                        ).innerText =
                            combo >= 3
                            ? "🌟 AMAZING COMBO!"
                            : "✅ Correct!";


                        createPopEffect(
                            selectedItem.element
                        );


                        selectedItem.element.remove();


                        selectedItem =
                            null;


                        /* ===============================
                           WIN
                        =============================== */

                        if (
                            score >= target
                        ) {

                            gameRunning =
                                false;


                            clearInterval(
                                spawnTimer
                            );


                            document.getElementById(
                                "miniGameMessage"
                            ).innerText =
                                "🎉 TOWN CLEANED!";


                            setTimeout(
                                function() {

                                    miniGameWin();

                                },
                                700
                            );

                        }

                    }

                    else {

                        /* ===============================
                           WRONG
                        =============================== */

                        combo = 0;


                        comboDisplay.innerText =
                            "🔥 Combo: 0";


                        document.getElementById(
                            "miniGameMessage"
                        ).innerText =
                            "❌ That's the wrong bin!";


                        selectedItem.element.style.transform =
                            "translateX(-8px)";


                        setTimeout(
                            function() {

                                if (
                                    selectedItem &&
                                    selectedItem.element
                                ) {

                                    selectedItem.element.style.transform =
                                        "";

                                }

                            },
                            120
                        );

                    }

                };


            bins.appendChild(
                bin
            );

        }
    );


    area.appendChild(
        bins
    );


    /* =====================================================
       RUBBISH TYPES
    ===================================================== */

    const rubbish =
        [

            {
                icon: "📰",
                type: "paper"
            },

            {
                icon: "📦",
                type: "paper"
            },

            {
                icon: "🥤",
                type: "plastic"
            },

            {
                icon: "🧴",
                type: "plastic"
            },

            {
                icon: "🍎",
                type: "food"
            },

            {
                icon: "🍌",
                type: "food"
            },

            {
                icon: "🔋",
                type: "electronic"
            },

            {
                icon: "📱",
                type: "electronic"
            }

        ];


    /* =====================================================
       CREATE RUBBISH
    ===================================================== */

    function spawnRubbish() {

    if (!gameRunning) {
        return;
    }

        const data =
            rubbish[
                Math.floor(
                    Math.random()
                    * rubbish.length
                )
            ];


        const item =
            document.createElement(
                "button"
            );


        item.innerText =
            data.icon;


        item.style.position =
            "absolute";


        item.style.left =
            (5 + Math.random() * 85)
            + "%";


        item.style.top =
    (25 + Math.random() * 25)
    + "%";


        item.style.fontSize =
            "30px";


        item.style.background =
            "transparent";


        item.style.border =
            "none";


        item.style.cursor =
            "pointer";


        item.style.zIndex =
            "60";


        item.style.transition =
            "transform 0.15s";


        area.appendChild(
            item
        );


        /* =================================================
           SELECT ITEM
        ================================================= */

        item.onclick =
            function() {

                if (
                    selectedItem === item
                ) {

                    selectedItem =
                        null;

                    item.style.transform =
                        "";

                    document.getElementById(
                        "miniGameMessage"
                    ).innerText =
                        "↩️ Put it down!";

                    return;

                }


                if (
                    selectedItem
                ) {

                    selectedItem.element.style.transform =
                        "";

                }


                selectedItem = {

                    element:
                        item,

                    type:
                        data.type

                };


                item.style.transform =
                    "scale(1.3)";


                document.getElementById(
                    "miniGameMessage"
                ).innerText =
                    "👉 Now choose the correct bin!";

            };


        /* =================================================
           AUTO REMOVE
        ================================================= */

        setTimeout(
            function() {

                if (
                    item.parentNode &&
                    selectedItem?.element !== item
                ) {

                    item.remove();

                }

            },
            4500
        );

    }


    /* =====================================================
       POP EFFECT
    ===================================================== */

    function createPopEffect(
        element
    ) {

        if (!element)
            return;


        const effect =
            document.createElement(
                "div"
            );


        effect.innerText =
            "✨ +1 ✨";


        effect.style.position =
            "absolute";


        effect.style.left =
            element.offsetLeft
            + "px";


        effect.style.top =
            element.offsetTop
            + "px";


        effect.style.color =
            "#f4e6a2";


        effect.style.fontWeight =
            "bold";


        effect.style.fontSize =
            "18px";


        effect.style.pointerEvents =
            "none";


        effect.style.zIndex =
            "200";


        area.appendChild(
            effect
        );


        let y = 0;


        const animation =
            setInterval(
                function() {

                    y -= 2;

                    effect.style.transform =
                        "translateY("
                        + y
                        + "px)";


                    effect.style.opacity =
                        1 +
                        y / 40;


                    if (
                        y <= -40
                    ) {

                        clearInterval(
                            animation
                        );

                        effect.remove();

                    }

                },
                30
            );

    }


    /* =====================================================
       START SPAWNING
    ===================================================== */

    spawnRubbish();


    spawnTimer =
        setInterval(
            spawnRubbish,
            1300
        );

}


/* =========================================================
   🚲 BIKE GAME
   ECO DELIVERY
========================================================= */

function startBikeGame() {

    const title =
        document.getElementById("miniGameTitle");

    const description =
        document.getElementById("miniGameDescription");

    const area =
        document.getElementById("miniGameArea");


    title.innerText =
        "🚲 ECO DELIVERY";

    description.innerText =
        "Collect 📦 and deliver them to 🏠!";


    area.innerHTML = "";


    /* =========================
       GAME SETTINGS
    ========================= */

    let bikeX = 45;

    let score = 0;

    const target = 8;

    const speed =
        2.5 + buildings.bike * 0.4;


    /* =========================
       BIKE
    ========================= */

    const bike =
        document.createElement("div");

    bike.innerText =
        "🚲";

    bike.style.position =
        "absolute";

    bike.style.left =
        bikeX + "%";

    bike.style.bottom =
        "10px";

    bike.style.fontSize =
        "40px";

    bike.style.width =
        "50px";

    bike.style.textAlign =
        "center";

    bike.style.zIndex =
        "10";

    bike.style.userSelect =
        "none";


    area.appendChild(
        bike
    );


    /* =========================
       KEYBOARD
    ========================= */

    let leftPressed = false;

    let rightPressed = false;


    function keyDown(event) {

        if (
            !miniGameRunning ||
            currentMiniGame !== "bike"
        ) {
            return;
        }


        if (
            event.key === "ArrowLeft" ||
            event.key.toLowerCase() === "a"
        ) {

            leftPressed = true;

            event.preventDefault();

        }


        if (
            event.key === "ArrowRight" ||
            event.key.toLowerCase() === "d"
        ) {

            rightPressed = true;

            event.preventDefault();

        }

    }


    function keyUp(event) {

        if (
            event.key === "ArrowLeft" ||
            event.key.toLowerCase() === "a"
        ) {

            leftPressed = false;

        }


        if (
            event.key === "ArrowRight" ||
            event.key.toLowerCase() === "d"
        ) {

            rightPressed = false;

        }

    }


    document.addEventListener(
        "keydown",
        keyDown
    );

    document.addEventListener(
        "keyup",
        keyUp
    );


    /* =========================
       SMOOTH MOVEMENT
    ========================= */

    function moveBike() {

        if (
            !miniGameRunning ||
            currentMiniGame !== "bike"
        ) {
            return;
        }


        if (leftPressed) {

            bikeX -= 0.8;

        }


        if (rightPressed) {

            bikeX += 0.8;

        }


        if (bikeX < 5) {

            bikeX = 5;

        }


        if (bikeX > 85) {

            bikeX = 85;

        }


        bike.style.left =
            bikeX + "%";


        requestAnimationFrame(
            moveBike
        );

    }


    moveBike();


    /* =========================
       SPAWN OBJECTS
    ========================= */

    const spawn =
        setInterval(function() {

            if (
                !miniGameRunning ||
                currentMiniGame !== "bike"
            ) {

                clearInterval(spawn);

                document.removeEventListener(
                    "keydown",
                    keyDown
                );

                document.removeEventListener(
                    "keyup",
                    keyUp
                );

                return;

            }


            const object =
                document.createElement("div");


            const random =
                Math.random();


            /* PACKAGE */

            if (
                random < 0.45
            ) {

                object.innerText =
                    "📦";

                object.dataset.type =
                    "package";

            }


            /* HOUSE */

            else if (
                random < 0.65
            ) {

                object.innerText =
                    "🏠";

                object.dataset.type =
                    "house";

            }


            /* CAR */

            else if (
                random < 0.85
            ) {

                object.innerText =
                    "🚗";

                object.dataset.type =
                    "car";

            }


            /* TREE */

            else {

                object.innerText =
                    "🌳";

                object.dataset.type =
                    "obstacle";

            }


            object.style.position =
                "absolute";

            object.style.left =
                (5 + Math.random() * 85)
                + "%";

            object.style.top =
                "-40px";

            object.style.fontSize =
                "30px";

            object.style.width =
                "45px";

            object.style.textAlign =
                "center";

            object.style.zIndex =
                "5";


            area.appendChild(
                object
            );


            /* =========================
               FALLING OBJECT
            ========================= */

            let objectY = -40;


            const fall =
                setInterval(function() {

                    if (
                        !miniGameRunning ||
                        currentMiniGame !== "bike"
                    ) {

                        clearInterval(
                            fall
                        );

                        if (
                            object.parentNode
                        ) {

                            object.remove();

                        }

                        return;

                    }


                    objectY += speed;


                    object.style.top =
                        objectY + "px";


                    /* =================
                       COLLISION
                    ================= */

                    const bikeRect =
                        bike.getBoundingClientRect();

                    const objectRect =
                        object.getBoundingClientRect();


                    if (

                        bikeRect.left <
                        objectRect.right &&

                        bikeRect.right >
                        objectRect.left &&

                        bikeRect.top <
                        objectRect.bottom &&

                        bikeRect.bottom >
                        objectRect.top

                    ) {

                        clearInterval(
                            fall
                        );

                        object.remove();


                        /* PACKAGE */

                        if (
                            object.dataset.type ===
                            "package"
                        ) {

                            document.getElementById(
                                "miniGameMessage"
                            ).innerText =
                                "📦 Package collected!";

                        }


                        /* HOUSE */

                        else if (
                            object.dataset.type ===
                            "house"
                        ) {

                            score++;


                            miniScore =
                                score;


                            document.getElementById(
                                "miniScore"
                            ).innerText =
                                score;


                            document.getElementById(
                                "miniGameMessage"
                            ).innerText =
                                "🏠 Delivery complete!";


                            if (
                                score >= target
                            ) {

                                clearInterval(
                                    spawn
                                );


                                document.removeEventListener(
                                    "keydown",
                                    keyDown
                                );

                                document.removeEventListener(
                                    "keyup",
                                    keyUp
                                );


                                miniGameWin();

                            }

                        }


                        /* OBSTACLE */

                        else {

                            score =
                                Math.max(
                                    0,
                                    score - 1
                                );


                            miniScore =
                                score;


                            document.getElementById(
                                "miniScore"
                            ).innerText =
                                score;


                            document.getElementById(
                                "miniGameMessage"
                            ).innerText =
                                "💥 Ouch! Watch out!";

                        }

                    }


                    /* =================
                       OBJECT MISSED
                    ================= */

                    if (
                        objectY >
                        area.clientHeight
                    ) {

                        clearInterval(
                            fall
                        );

                        object.remove();

                    }

                }, 30);


        }, 800);

}


/* =========================================================
   🚌 BUS GAME
   ECO BUS RACE
========================================================= */

function startBusGame() {

    const title =
        document.getElementById("miniGameTitle");

    const description =
        document.getElementById("miniGameDescription");

    const area =
        document.getElementById("miniGameArea");


    title.innerText =
        "🚌 ECO BUS RACE";

    description.innerText =
        "Race through the city! Collect 🌱 and avoid 🚗!";


    area.innerHTML = "";


    /* =========================
       GAME SETTINGS
    ========================= */

    let busX = 42;

    let score = 0;

    let speed =
        3 + buildings.bus * 0.5;


    const target = 10;


    /* =========================
       ROAD
    ========================= */

    area.style.background =
        "#333";

    area.style.overflow =
        "hidden";


    /* Road lines */

    for (
        let i = 0;
        i < 8;
        i++
    ) {

        const line =
            document.createElement("div");

        line.className =
            "road-line";

        line.style.top =
            (i * 35) + "px";

        area.appendChild(line);

    }


    /* =========================
       BUS
    ========================= */

    const bus =
        document.createElement("div");

    bus.className =
        "race-bus";

    bus.innerText =
        "🚌";


    bus.style.position =
        "absolute";

    bus.style.left =
        busX + "%";

    bus.style.bottom =
        "10px";

    bus.style.fontSize =
        "40px";

    bus.style.width =
        "50px";

    bus.style.textAlign =
        "center";

    bus.style.zIndex =
        "10";


    area.appendChild(bus);


    /* =========================
       KEYBOARD
    ========================= */

    let leftPressed = false;

    let rightPressed = false;


    function keyDown(event) {

        if (
            !miniGameRunning ||
            currentMiniGame !== "bus"
        ) {
            return;
        }


        if (
            event.key === "ArrowLeft" ||
            event.key.toLowerCase() === "a"
        ) {

            leftPressed = true;

            event.preventDefault();

        }


        if (
            event.key === "ArrowRight" ||
            event.key.toLowerCase() === "d"
        ) {

            rightPressed = true;

            event.preventDefault();

        }

    }


    function keyUp(event) {

        if (
            event.key === "ArrowLeft" ||
            event.key.toLowerCase() === "a"
        ) {

            leftPressed = false;

        }


        if (
            event.key === "ArrowRight" ||
            event.key.toLowerCase() === "d"
        ) {

            rightPressed = false;

        }

    }


    document.addEventListener(
        "keydown",
        keyDown
    );

    document.addEventListener(
        "keyup",
        keyUp
    );


    /* =========================
       SMOOTH BUS MOVEMENT
    ========================= */

    function moveBus() {

        if (
            !miniGameRunning ||
            currentMiniGame !== "bus"
        ) {
            return;
        }


        if (leftPressed) {

            busX -= 0.8;

        }


        if (rightPressed) {

            busX += 0.8;

        }


        if (busX < 5) {

            busX = 5;

        }


        if (busX > 85) {

            busX = 85;

        }


        bus.style.left =
            busX + "%";


        requestAnimationFrame(
            moveBus
        );

    }


    moveBus();


    /* =========================
       SPAWN OBJECTS
    ========================= */

    const spawn =
        setInterval(function() {

            if (
                !miniGameRunning ||
                currentMiniGame !== "bus"
            ) {

                clearInterval(spawn);

                document.removeEventListener(
                    "keydown",
                    keyDown
                );

                document.removeEventListener(
                    "keyup",
                    keyUp
                );

                return;

            }


            const object =
                document.createElement("div");


            const random =
                Math.random();


            /* GOOD OBJECT */

            if (
                random < 0.55
            ) {

                object.innerText =
                    Math.random() < 0.5
                    ? "🌱"
                    : "🪙";

                object.dataset.good =
                    "true";

            }


            /* CAR */

            else if (
                random < 0.85
            ) {

                object.innerText =
                    "🚗";

                object.dataset.good =
                    "false";

            }


            /* ROAD BLOCK */

            else {

                object.innerText =
                    "🚧";

                object.dataset.good =
                    "false";

            }


            object.style.position =
                "absolute";

            object.style.left =
                (5 + Math.random() * 85)
                + "%";

            object.style.top =
                "-40px";

            object.style.fontSize =
                "30px";

            object.style.width =
                "45px";

            object.style.textAlign =
                "center";

            object.style.zIndex =
                "5";


            area.appendChild(
                object
            );


            /* =====================
               FALLING OBJECT
            ===================== */

            let objectY = -40;


            const fall =
                setInterval(function() {

                    if (
                        !miniGameRunning ||
                        currentMiniGame !== "bus"
                    ) {

                        clearInterval(fall);

                        if (
                            object.parentNode
                        ) {

                            object.remove();

                        }

                        return;

                    }


                    objectY += speed;


                    object.style.top =
                        objectY + "px";


                    /* =================
                       COLLISION
                    ================= */

                    const busRect =
                        bus.getBoundingClientRect();

                    const objectRect =
                        object.getBoundingClientRect();


                    if (

                        busRect.left <
                        objectRect.right &&

                        busRect.right >
                        objectRect.left &&

                        busRect.top <
                        objectRect.bottom &&

                        busRect.bottom >
                        objectRect.top

                    ) {

                        clearInterval(fall);

                        object.remove();


                        if (
                            object.dataset.good ===
                            "true"
                        ) {

                            score++;

                            miniScore =
                                score;


                            document.getElementById(
                                "miniScore"
                            ).innerText =
                                score;


                            document.getElementById(
                                "miniGameMessage"
                            ).innerText =
                                "🌱 Great driving!";


                            if (
                                score >= target
                            ) {

                                clearInterval(
                                    spawn
                                );


                                document.removeEventListener(
                                    "keydown",
                                    keyDown
                                );

                                document.removeEventListener(
                                    "keyup",
                                    keyUp
                                );


                                miniGameWin();

                            }

                        }

                        else {

                            score =
                                Math.max(
                                    0,
                                    score - 1
                                );


                            miniScore =
                                score;


                            document.getElementById(
                                "miniScore"
                            ).innerText =
                                score;


                            document.getElementById(
                                "miniGameMessage"
                            ).innerText =
                                "💥 Watch out!";

                        }

                    }


                    /* =================
                       OBJECT MISSED
                    ================= */

                    if (
                        objectY >
                        area.clientHeight
                    ) {

                        clearInterval(
                            fall
                        );

                        object.remove();

                    }

                }, 30);


        }, 700);

}



/* =========================================================
   🏠 HOUSE GAME
   ENERGY SAVER
========================================================= */

function startHouseGame() {

    const title =
        document.getElementById("miniGameTitle");

    const description =
        document.getElementById("miniGameDescription");

    const area =
        document.getElementById("miniGameArea");


    title.innerText =
        "🏠 ENERGY SAVER";

    description.innerText =
        "Quick! Turn off appliances wasting energy!";


    area.innerHTML = "";


    /* =========================
       GAME SETTINGS
    ========================= */

    let score = 0;

    const target = 8;

    const appliances = [

        {
            icon: "💡",
            name: "Light",
            waste: true
        },

        {
            icon: "📺",
            name: "TV",
            waste: true
        },

        {
            icon: "💻",
            name: "Computer",
            waste: true
        },

        {
            icon: "🎮",
            name: "Game Console",
            waste: true
        },

        {
            icon: "❄️",
            name: "Air Conditioner",
            waste: false
        },

        {
            icon: "🧊",
            name: "Refrigerator",
            waste: false
        },

        {
            icon: "🚿",
            name: "Shower",
            waste: false
        }

    ];


    let gameActive = true;


    /* =========================
       SHOW APPLIANCE
    ========================= */

    function showAppliance() {

        if (
            !miniGameRunning ||
            currentMiniGame !== "house"
        ) {
            gameActive = false;
            return;
        }


        area.innerHTML = "";


        const appliance =
            appliances[
                Math.floor(
                    Math.random()
                    * appliances.length
                )
            ];


        const item =
            document.createElement("button");


        item.className =
            "house-energy-item";


        item.innerText =
            appliance.icon;


        item.title =
            appliance.name;


        item.style.position =
            "absolute";


        item.style.left =
            (10 + Math.random() * 75)
            + "%";


        item.style.top =
            (10 + Math.random() * 55)
            + "%";


        item.style.fontSize =
            "50px";


        item.style.background =
            "transparent";


        item.style.border =
            "none";


        item.style.cursor =
            "pointer";


        item.style.transition =
            "transform 0.15s";


        area.appendChild(
            item
        );


        /* =========================
           CLICK
        ========================= */

        item.onclick =
            function() {

                if (
                    !gameActive
                ) {
                    return;
                }


                if (
                    appliance.waste
                ) {

                    score++;


                    miniScore =
                        score;


                    document.getElementById(
                        "miniScore"
                    ).innerText =
                        score;


                    document.getElementById(
                        "miniGameMessage"
                    ).innerText =
                        "⚡ Good! Energy saved!";


                    item.style.transform =
                        "scale(1.5)";


                    if (
                        score >= target
                    ) {

                        gameActive = false;


                        miniGameWin();

                        return;

                    }


                    setTimeout(
                        showAppliance,
                        300
                    );

                }

                else {

                    score =
                        Math.max(
                            0,
                            score - 1
                        );


                    miniScore =
                        score;


                    document.getElementById(
                        "miniScore"
                    ).innerText =
                        score;


                    document.getElementById(
                        "miniGameMessage"
                    ).innerText =
                        "⚠️ This appliance should stay on!";


                    item.style.transform =
                        "scale(0.7)";


                    setTimeout(
                        showAppliance,
                        500
                    );

                }

            };


        /* =========================
           AUTO MOVE
        ========================= */

        let direction =
            Math.random() > 0.5
            ? 1
            : -1;


        let position =
            parseFloat(
                item.style.left
            );


        const movement =
            setInterval(
                function() {

                    if (
                        !gameActive ||
                        !miniGameRunning
                    ) {

                        clearInterval(
                            movement
                        );

                        return;

                    }


                    position +=
                        direction * 0.25;


                    if (
                        position > 82
                    ) {

                        direction = -1;

                    }


                    if (
                        position < 5
                    ) {

                        direction = 1;

                    }


                    item.style.left =
                        position + "%";


                },
                30
            );


        /* =========================
           DISAPPEAR TIMER
        ========================= */

        const disappearTime =
            Math.max(
                8000,
                10000 -
                buildings.house * 200
            );


        setTimeout(
            function() {

                if (
                    !gameActive ||
                    !miniGameRunning
                ) {
                    return;
                }


                if (
                    area.contains(item)
                ) {

                    item.remove();


                    document.getElementById(
                        "miniGameMessage"
                    ).innerText =
                        "⏰ Too slow!";

                }


                showAppliance();

            },
            disappearTime
        );

    }


    showAppliance();

}

/* =========================================================
   MINI GAME WIN
========================================================= */

function miniGameWin() {

    if (
        !miniGameRunning
    ) {

        return;

    }


    miniGameRunning = false;


    clearInterval(
        miniInterval
    );


    /*
       Save the feature name
       before closing the game.
    */

    const type =
        currentMiniGame;


    const cost =
        costs[type];


    /*
       Challenge reward
    */

    const reward =
        15 +
        buildings[type] * 10;


    /*
       Pay upgrade cost
    */

    coins -= cost;


    /*
       Upgrade feature
    */

    buildings[type]++;


    /*
       Give reward
    */

    coins += reward;


    /*
       Apply environmental effects
    */

    updateStats(type);


    /*
       Change icon
    */

    updateFeatureIcon(type);


    /*
       Update everything
    */

    updateCoins();

    updatePopulation();

    updateWildlife();

    checkMission();

    checkLevel();


    const message =
        document.getElementById(
            "miniGameMessage"
        );


    if (message) {

        message.innerText =
            "🎉 SUCCESS!";

    }


    setTimeout(
        function() {

            closeMiniGame();


            showMessage(

                type.toUpperCase()
                + " upgraded to LEVEL "
                + buildings[type]
                + "! +"
                + reward
                + " 🪙"

            );

        },
        900
    );

}


/* =========================================================
   MINI GAME LOSE
========================================================= */

function miniGameLose() {

    if (
        !miniGameRunning
    ) {

        return;

    }


    miniGameRunning = false;


    clearInterval(
        miniInterval
    );


    const message =
        document.getElementById(
            "miniGameMessage"
        );


    if (message) {

        message.innerText =
            "⏰ TIME'S UP!";

    }


    setTimeout(
        function() {

            closeMiniGame();


            showMessage(
                "Challenge failed! Try again."
            );

        },
        900
    );

}


/* =========================================================
   CLOSE MINI GAME
========================================================= */

function closeMiniGame() {

    miniGameRunning = false;


    clearInterval(
        miniInterval
    );


    const overlay =
        document.getElementById(
            "minigameOverlay"
        );


    const area =
        document.getElementById(
            "miniGameArea"
        );


    if (overlay) {

        overlay.style.display =
            "none";

    }


    if (area) {

        area.innerHTML =
            "";

    }


    currentMiniGame =
        null;

}


/* =========================================================
   INITIALIZE
========================================================= */

updateBars();

updateCoins();

updatePopulation();

updateWildlife();

changeWeather();

/* =========================================================
   WORLD CAMERA
========================================================= */

const city = document.getElementById("city");
const worldMap = document.getElementById("worldMap");

let cameraX = 0;
let cameraY = 0;

let dragging = false;

let mouseStartX = 0;
let mouseStartY = 0;


/* =========================================================
   MOUSE DOWN
========================================================= */

city.addEventListener("mousedown", function(e) {

    dragging = true;

    mouseStartX = e.clientX;
    mouseStartY = e.clientY;

    city.style.cursor = "grabbing";

});


/* =========================================================
   MOUSE UP
========================================================= */

document.addEventListener("mouseup", function() {

    dragging = false;

    city.style.cursor = "grab";

});


/* =========================================================
   MOUSE MOVE
========================================================= */

city.addEventListener("mousemove", function(e) {

    if (!dragging)
        return;


    const dx =
        e.clientX - mouseStartX;

    const dy =
        e.clientY - mouseStartY;


    cameraX += dx;
    cameraY += dy;


    mouseStartX =
        e.clientX;

    mouseStartY =
        e.clientY;


    updateCamera();

});


/* =========================================================
   CAMERA LIMIT
========================================================= */

function updateCamera() {

    const maxX =
        worldMap.offsetWidth -
        city.clientWidth;


    const maxY =
        worldMap.offsetHeight -
        city.clientHeight;


    cameraX =
        Math.max(
            -maxX,
            Math.min(
                0,
                cameraX
            )
        );


    cameraY =
        Math.max(
            -maxY,
            Math.min(
                0,
                cameraY
            )
        );


    worldMap.style.transform =
        "translate("
        + cameraX
        + "px, "
        + cameraY
        + "px)";
}


/* =========================================================
   START CAMERA
========================================================= */

city.style.cursor = "grab";

updateCamera();