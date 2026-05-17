(function() {
    // ====== MOD IMPLEMENTATION PLACEHOLDERS ======
    const ModActions = {
        godMode: (on) => console.log("God Mode:", on),
        speedHack: (on) => console.log("Speed Hack:", on),
        noClip: (on) => console.log("NoClip:", on),
        autoAnswer: (on) => console.log("Auto Answer:", on),
        instaWin: (on) => console.log("Insta Win:", on),
        freezeTimer: (on) => console.log("Freeze Timer:", on),
        revealAnswers: (on) => console.log("Reveal Answers:", on),
        spamAnswers: (on) => console.log("Spam Answers:", on),
        rainbowUI: (on) => console.log("Rainbow UI:", on),
        hideUI: (on) => console.log("Hide UI:", on),
        aimbot: (on) => console.log("Aimbot:", on),
        antiAFK: (on) => console.log("Anti AFK:", on),
        slowMotion: (on) => console.log("Slow Motion:", on),
        fastForward: (on) => console.log("Fast Forward:", on),
        debugOverlay: (on) => console.log("Debug Overlay:", on),
        hitboxExpand: (on) => console.log("Hitbox Expand:", on),
        silentMode: (on) => console.log("Silent Mode:", on),
        chaosMode: (on) => console.log("Chaos Mode:", on),
        test1: (on) => console.log("Test Mod 1:", on),
        test2: (on) => console.log("Test Mod 2:", on),
        test3: (on) => console.log("Test Mod 3:", on)
    };

    // ====== MENU DATA ======
    const categories = [
        {
            name: "Menu Settings",
            mods: [
                { name: "Rainbow UI", key: "rainbowUI", active: false },
                { name: "Hide UI", key: "hideUI", active: false },
                { name: "Debug Overlay", key: "debugOverlay", active: false },
                { name: "Silent Mode", key: "silentMode", active: false }
            ]
        },
        {
            name: "Player",
            mods: [
                { name: "God Mode", key: "godMode", active: false },
                { name: "Speed Hack", key: "speedHack", active: false },
                { name: "NoClip", key: "noClip", active: false },
                { name: "Anti AFK", key: "antiAFK", active: false },
                { name: "Hitbox Expand", key: "hitboxExpand", active: false }
            ]
        },
        {
            name: "Exploits",
            mods: [
                { name: "Auto Answer", key: "autoAnswer", active: false },
                { name: "Insta Win", key: "instaWin", active: false },
                { name: "Freeze Timer", key: "freezeTimer", active: false },
                { name: "Reveal Answers", key: "revealAnswers", active: false },
                { name: "Spam Answers", key: "spamAnswers", active: false },
                { name: "Aimbot", key: "aimbot", active: false },
                { name: "Chaos Mode", key: "chaosMode", active: false }
            ]
        },
        {
            name: "Other",
            mods: [
                { name: "Slow Motion", key: "slowMotion", active: false },
                { name: "Fast Forward", key: "fastForward", active: false }
            ]
        },
        {
            name: "Test Mods",
            mods: [
                { name: "Test Mod 1", key: "test1", active: false },
                { name: "Test Mod 2", key: "test2", active: false },
                { name: "Test Mod 3", key: "test3", active: false }
            ]
        }
    ];

    let selectedCategory = 0;
    let selectedModIndex = 0;
    let inCategory = false;

    // ====== CREATE FLOATING TEXT MENU ======
    const menu = document.createElement("div");
    menu.id = "pizzaMenuFloating";
    menu.innerHTML = `
        <div class="pizza-title">▲ PIZZA [1.1]</div>
        <div id="pizzaLines"></div>
    `;
    document.body.appendChild(menu);

    const style = document.createElement("style");
    style.innerHTML = `
        #pizzaMenuFloating {
            position: fixed;
            top: 20px;
            right: 20px;
            color: #ff8a2b;
            font-family: monospace;
            font-size: 18px; /* BIGGER */
            z-index: 999999;
            user-select: none;
            pointer-events: none;
        }
        #pizzaMenuFloating .pizza-title {
            margin-bottom: 6px;
            font-size: 20px;
        }
        #pizzaMenuFloating .line {
            white-space: nowrap;
        }
        #pizzaMenuFloating .selected::before {
            content: "→ ";
        }
        #pizzaMenuFloating .category-label {
            text-transform: uppercase;
            margin-bottom: 4px;
        }
        .mod-symbol {
            display: inline-block;
            width: 14px;
        }
        .mod-on {
            color: #c77bff; /* LIGHT PURPLE + */
        }
        .mod-off {
            color: #ff4d4d; /* RED - */
        }
    `;
    document.head.appendChild(style);

    // ====== RENDER ======
    function renderMenu() {
        const lines = [];
        lines.push(`<div class="line category-label">[${categories[selectedCategory].name}]</div>`);

        const mods = categories[selectedCategory].mods;
        mods.forEach((mod, i) => {
            const selected = inCategory && i === selectedModIndex ? "selected" : "";
            const symbol = mod.active
                ? `<span class="mod-symbol mod-on">+</span>`
                : `<span class="mod-symbol mod-off">-</span>`;

            lines.push(`
                <div class="line ${selected}">
                    ${symbol} ${mod.name}
                </div>
            `);
        });

        document.getElementById("pizzaLines").innerHTML = lines.join("");
    }

    renderMenu();

    // ====== TOGGLE MOD ======
    function toggleMod(catIndex, modIndex) {
        const mod = categories[catIndex].mods[modIndex];
        mod.active = !mod.active;
        const fn = ModActions[mod.key];
        if (typeof fn === "function") fn(mod.active);
    }

    // ====== KEYBINDS ======
    document.addEventListener("keydown", (e) => {
        if (e.key === "ArrowUp") {
            if (!inCategory) {
                selectedCategory = (selectedCategory - 1 + categories.length) % categories.length;
                selectedModIndex = 0;
            } else {
                const mods = categories[selectedCategory].mods;
                selectedModIndex = (selectedModIndex - 1 + mods.length) % mods.length;
            }
            renderMenu();
        }

        if (e.key === "ArrowDown") {
            if (!inCategory) {
                selectedCategory = (selectedCategory + 1) % categories.length;
                selectedModIndex = 0;
            } else {
                const mods = categories[selectedCategory].mods;
                selectedModIndex = (selectedModIndex + 1) % mods.length;
            }
            renderMenu();
        }

        if (e.key === " ") {
            e.preventDefault();
            if (!inCategory) {
                inCategory = true;
                selectedModIndex = 0;
            } else {
                toggleMod(selectedCategory, selectedModIndex);
            }
            renderMenu();
        }

        if (e.key === "Escape") {
            inCategory = false;
            renderMenu();
        }
    });
})();
