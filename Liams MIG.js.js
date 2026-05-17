(function() {

    // =========================
    //  CREATE PANEL + STRUCTURE
    // =========================
    const mig = document.createElement("div");
    mig.id = "liamMIG";
    mig.innerHTML = `
        <canvas id="migNodes"></canvas>

        <div id="migTitle">Liam.MIG</div>

        <div id="migTabs">
            <div class="migTab active" data-tab="player">Player</div>
            <div class="migTab" data-tab="exploits">Exploits</div>
            <div class="migTab" data-tab="visual">Visual</div>
            <div class="migTab" data-tab="host">Host</div>
            <div class="migTab" data-tab="chaos">Chaos</div>
        </div>

        <div id="migContent"></div>

        <div id="migResize"></div>
    `;
    document.body.appendChild(mig);

    // =========================
    //  STYLES (INJECTED)
    // =========================
    const style = document.createElement("style");
    style.textContent = `
        #liamMIG {
            position: fixed;
            top: 20px;
            right: 20px;
            width: 480px;
            height: 380px;

            background: rgba(255, 255, 255, 0.15);
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);

            border: 2px solid rgba(255, 255, 255, 0.25);
            border-radius: 12px;

            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.35);

            font-family: Arial, sans-serif;
            z-index: 999999;
            display: flex;
            flex-direction: column;
            overflow: hidden;
        }

        #migNodes {
            position: absolute;
            inset: 0;
            width: 100%;
            height: 100%;
            z-index: -1;
        }

        #migTitle {
            background: rgba(40,40,40,0.85);
            color: white;
            padding: 8px;
            cursor: move;
            font-weight: bold;
            border-bottom: 2px solid rgba(0,0,0,0.4);
            user-select: none;
        }

        #migTabs {
            display: flex;
            background: rgba(200,200,200,0.4);
            border-bottom: 2px solid rgba(255,255,255,0.2);
        }

        .migTab {
            padding: 6px 12px;
            cursor: pointer;
            user-select: none;
            border-right: 1px solid rgba(255,255,255,0.2);
        }

        .migTab.active {
            background: rgba(255,255,255,0.6);
            font-weight: bold;
        }

        #migContent {
            flex: 1;
            padding: 10px;
            overflow-y: auto;
        }

        .switchRow {
            display: flex;
            align-items: center;
            margin-bottom: 8px;
        }

        .switchBox {
            width: 60px;
            padding: 4px;
            background: #ccc;
            border: 1px solid #555;
            text-align: center;
            cursor: pointer;
            margin-right: 10px;
            user-select: none;
        }

        .switchBox.on {
            background: #8fda8f;
            border-color: #2d7a2d;
        }

        .switchLabel {
            font-size: 14px;
        }

        .sliderRow {
            margin: 10px 0;
            display: flex;
            flex-direction: column;
        }

        #migResize {
            width: 14px;
            height: 14px;
            background: #555;
            position: absolute;
            bottom: 2px;
            right: 2px;
            cursor: se-resize;
            border-radius: 3px;
        }
    `;
    document.head.appendChild(style);

    // =========================
    //  SWITCH BUILDER
    // =========================
    function makeSwitch(name, key) {
        return `
            <div class="switchRow" data-key="${key}">
                <div class="switchBox" data-state="off">[ OFF ]</div>
                <span class="switchLabel">${name}</span>
            </div>
        `;
    }

    // =========================
    //  TAB CONTENT
    // =========================
    const tabPages = {
        player: `
            ${makeSwitch("Auto Answer", "autoAnswer")}
            ${makeSwitch("Insta Answer", "instaAnswer")}
            ${makeSwitch("Always Correct", "alwaysCorrect")}
            ${makeSwitch("Random Correct", "randomCorrect")}
            <div class="sliderRow">
                <label>Answer Delay (ms)</label>
                <input type="range" min="0" max="3000" value="500" id="delaySlider">
            </div>
            ${makeSwitch("Auto Join", "autoJoin")}
            ${makeSwitch("Name Randomizer", "nameRandom")}
        `,

        exploits: `
            ${makeSwitch("Freeze Timer", "freezeTimer")}
            ${makeSwitch("Skip Question", "skipQuestion")}
            ${makeSwitch("Force Next Question", "forceNext")}
            ${makeSwitch("Reveal Correct Answer", "revealAnswer")}
            ${makeSwitch("Spam Answers", "spamAnswers")}
            ${makeSwitch("Bot Flood", "botFlood")}
            ${makeSwitch("Kick All Bots", "kickBots")}
        `,

        visual: `
            ${makeSwitch("Rainbow UI", "rainbowUI")}
            ${makeSwitch("Hide UI", "hideUI")}
            ${makeSwitch("Custom Theme", "customTheme")}
            ${makeSwitch("Debug Overlay", "debugOverlay")}
            ${makeSwitch("FPS Counter", "fpsCounter")}
        `,

        host: `
            ${makeSwitch("Force End Game", "forceEnd")}
            ${makeSwitch("Force Leaderboard", "forceLeaderboard")}
            ${makeSwitch("Change Question", "changeQuestion")}
            ${makeSwitch("Set Score", "setScore")}
            ${makeSwitch("Infinite Points", "infinitePoints")}
        `,

        chaos: `
            ${makeSwitch("Screen Shake", "screenShake")}
            ${makeSwitch("Fake Error Popups", "fakeErrors")}
            ${makeSwitch("Random Sounds", "randomSounds")}
            ${makeSwitch("Moony Mode", "moonyMode")}
            ${makeSwitch("Meme Spam", "memeSpam")}
        `
    };

    const content = document.getElementById("migContent");
    content.innerHTML = tabPages.player;

    // =========================
    //  TAB SWITCHING
    // =========================
    document.querySelectorAll(".migTab").forEach(tab => {
        tab.addEventListener("click", () => {
            document.querySelectorAll(".migTab").forEach(t => t.classList.remove("active"));
            tab.classList.add("active");

            const tabName = tab.dataset.tab;
            content.innerHTML = tabPages[tabName];
            attachSwitchLogic();
        });
    });

    // =========================
    //  SWITCH LOGIC
    // =========================
    function attachSwitchLogic() {
        document.querySelectorAll("#liamMIG .switchBox").forEach(box => {
            box.addEventListener("click", () => {
                const key = box.parentElement.dataset.key;
                const isOn = box.classList.toggle("on");

                box.textContent = isOn ? "[ ON ]" : "[ OFF ]";

                console.log("Liam.MIG:", key + " =", isOn);
            });
        });
    }
    attachSwitchLogic();

    // =========================
    //  DRAGGING
    // =========================
    let dragging = false;
    let offsetX = 0;
    let offsetY = 0;

    document.getElementById("migTitle").addEventListener("mousedown", (e) => {
        dragging = true;
        offsetX = e.clientX - mig.offsetLeft;
        offsetY = e.clientY - mig.offsetTop;
    });

    document.addEventListener("mouseup", () => dragging = false);

    document.addEventListener("mousemove", (e) => {
        if (!dragging) return;
        mig.style.left = (e.clientX - offsetX) + "px";
        mig.style.top = (e.clientY - offsetY) + "px";
    });

    // =========================
    //  RESIZING
    // =========================
    let resizing = false;

    document.getElementById("migResize").addEventListener("mousedown", () => {
        resizing = true;
    });

    document.addEventListener("mouseup", () => resizing = false);

    document.addEventListener("mousemove", (e) => {
        if (!resizing) return;
        mig.style.width = (e.clientX - mig.getBoundingClientRect().left) + "px";
        mig.style.height = (e.clientY - mig.getBoundingClientRect().top) + "px";
        resizeCanvas();
    });

    // =========================
    //  NODE GRID BACKGROUND
    // =========================
    const canvas = document.getElementById("migNodes");
    const ctx = canvas.getContext("2d");

    let nodes = [];
    const NODE_COUNT = 35;
    const MAX_DIST = 120;

    function resizeCanvas() {
        canvas.width = mig.clientWidth;
        canvas.height = mig.clientHeight;
    }
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    for (let i = 0; i < NODE_COUNT; i++) {
        nodes.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 0.4,
            vy: (Math.random() - 0.5) * 0.4
        });
    }

    let mouse = { x: 0, y: 0 };

    mig.addEventListener("mousemove", (e) => {
        const rect = mig.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
    });

    function drawNodes() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        nodes.forEach(n => {
            n.x += n.vx;
            n.y += n.vy;

            if (n.x < 0 || n.x > canvas.width) n.vx *= -1;
            if (n.y < 0 || n.y > canvas.height) n.vy *= -1;

            ctx.fillStyle = "rgba(255,255,255,0.7)";
            ctx.beginPath();
            ctx.arc(n.x, n.y, 2.2, 0, Math.PI * 2);
            ctx.fill();

            const dxm = n.x - mouse.x;
            const dym = n.y - mouse.y;
            const distMouse = Math.sqrt(dxm*dxm + dym*dym);

            if (distMouse < MAX_DIST) {
                ctx.strokeStyle = "rgba(255,255,255," + (1 - distMouse / MAX_DIST) + ")";
                ctx.beginPath();
                ctx.moveTo(n.x, n.y);
                ctx.lineTo(mouse.x, mouse.y);
                ctx.stroke();
            }

            nodes.forEach(n2 => {
                const dx = n.x - n2.x;
                const dy = n.y - n2.y;
                const dist = Math.sqrt(dx*dx + dy*dy);

                if (dist < MAX_DIST) {
                    ctx.strokeStyle = "rgba(255,255,255," + (1 - dist / MAX_DIST) + ")";
                    ctx.beginPath();
                    ctx.moveTo(n.x, n.y);
                    ctx.lineTo(n2.x, n2.y);
                    ctx.stroke();
                }
            });
        });

        requestAnimationFrame(drawNodes);
    }

    drawNodes();

})();
