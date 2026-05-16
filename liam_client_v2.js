/* Liam Client v2 – SAFE PACKED EDITION (Glow Trail, Movement, Sliders, UI) */
(() => {
    if (window.__liam_client__) return;
    window.__liam_client__ = true;

    /********************
     * GLOBAL STATE
     ********************/
    let flyEnabled = false;
    let flySpeed = 6;
    let speedMult = 1;
    let slowmoMult = 1;
    let noClipEnabled = false;
    let autoResetEnabled = false;

    let gravityScale = 1;
    let frictionScale = 1;
    let slopeScale = 1;

    let teleportMode = false;
    let crosshairEnabled = false;
    let tracerEnabled = false;
    let trailEnabled = true; // glow trail ON by default

    const flyKeys = { w: false, a: false, s: false, d: false, space: false, shift: false };

    window.addEventListener("keydown", e => {
        const k = e.key.toLowerCase();
        if (k in flyKeys) flyKeys[k] = true;
    });
    window.addEventListener("keyup", e => {
        const k = e.key.toLowerCase();
        if (k in flyKeys) flyKeys[k] = false;
    });

    /********************
     * HOOK ENGINE + OVERLAY
     ********************/
    if (!window.liamHookEngine) {
        window.liamHookEngine = true;
        window.liamHooks = {
            fpsEnabled: false,
            overlayEnabled: true,
            callbacks: []
        };

        // Overlay canvas
        const overlay = document.createElement("canvas");
        overlay.id = "liamOverlay";
        overlay.width = innerWidth;
        overlay.height = innerHeight;
        overlay.style = "position:fixed;top:0;left:0;pointer-events:none;z-index:999998;display:block";
        document.body.appendChild(overlay);
        const ctx = overlay.getContext("2d");

        // FPS box
        const fpsBox = document.createElement("div");
        fpsBox.id = "liamFPSBox";
        fpsBox.style = "position:fixed;top:10px;right:10px;color:lime;font-family:monospace;font-size:14px;z-index:999999;background:rgba(0,0,0,0.6);padding:4px 6px;border-radius:4px;display:none";
        document.body.appendChild(fpsBox);

        let last = performance.now();
        let frames = 0;

        addEventListener("resize", () => {
            overlay.width = innerWidth;
            overlay.height = innerHeight;
        });

        // Trail history
        const trailPoints = [];

        function drawGlowTrail() {
            if (!trailEnabled) return;
            if (!window.slopeGame || !window.slopeGame.player) return;
            const p = window.slopeGame.player;
            const x = p.x || 0;
            const y = p.y || 0;

            trailPoints.push({ x, y, t: performance.now() });
            const now = performance.now();
            const life = 600; // ms

            // Remove old points
            while (trailPoints.length && now - trailPoints[0].t > life) {
                trailPoints.shift();
            }

            if (trailPoints.length < 2) return;

            ctx.save();
            ctx.lineWidth = 6;
            ctx.lineCap = "round";
            ctx.lineJoin = "round";

            for (let i = 1; i < trailPoints.length; i++) {
                const a = trailPoints[i - 1];
                const b = trailPoints[i];
                const age = (now - b.t) / life;
                const alpha = Math.max(0, 1 - age);
                ctx.strokeStyle = `rgba(0, 255, 200, ${alpha * 0.8})`;
                ctx.beginPath();
                ctx.moveTo(a.x, a.y);
                ctx.lineTo(b.x, b.y);
                ctx.stroke();
            }

            ctx.restore();
        }

        function drawCrosshair() {
            if (!crosshairEnabled) return;
            const cx = innerWidth / 2;
            const cy = innerHeight / 2;
            ctx.save();
            ctx.strokeStyle = "rgba(255,255,255,0.8)";
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(cx - 8, cy);
            ctx.lineTo(cx + 8, cy);
            ctx.moveTo(cx, cy - 8);
            ctx.lineTo(cx, cy + 8);
            ctx.stroke();
            ctx.restore();
        }

        function drawTracer() {
            if (!tracerEnabled) return;
            if (!window.slopeGame || !window.slopeGame.player) return;
            const p = window.slopeGame.player;
            ctx.save();
            ctx.strokeStyle = "rgba(0,200,255,0.8)";
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(innerWidth / 2, innerHeight / 2);
            ctx.lineTo(p.x || 0, p.y || 0);
            ctx.stroke();
            ctx.restore();
        }

        window.LiamAPI = {
            enableFPS() {
                window.liamHooks.fpsEnabled = true;
                fpsBox.style.display = "block";
            },
            disableFPS() {
                window.liamHooks.fpsEnabled = false;
                fpsBox.style.display = "none";
            },
            enableOverlay() {
                window.liamHooks.overlayEnabled = true;
                overlay.style.display = "block";
            },
            disableOverlay() {
                window.liamHooks.overlayEnabled = false;
                overlay.style.display = "none";
            },
            addOverlayCallback(cb) {
                window.liamHooks.callbacks.push(cb);
            },
            _elements: { overlay, fpsBox }
        };

        // Register overlay callbacks
        LiamAPI.addOverlayCallback(drawGlowTrail);
        LiamAPI.addOverlayCallback(drawCrosshair);
        LiamAPI.addOverlayCallback(drawTracer);

        // Main loop
        (function loop() {
            const now = performance.now();
            frames++;

            if (window.liamHooks.fpsEnabled && now - last >= 1000) {
                fpsBox.textContent = frames + " FPS";
                frames = 0;
                last = now;
            }

            if (window.liamHooks.overlayEnabled) {
                overlay.style.pointerEvents = "none";
                ctx.clearRect(0, 0, overlay.width, overlay.height);
                for (const cb of window.liamHooks.callbacks) {
                    try { cb(ctx); } catch (e) {}
                }
            }

            requestAnimationFrame(loop);
        })();
    }

    /********************
     * STYLES
     ********************/
    const style = document.createElement("style");
    style.textContent = `
#liamClient{
  position:fixed;
  top:80px;
  left:80px;
  width:340px;
  background:rgba(10,10,15,0.96);
  color:#eee;
  font-family:system-ui,sans-serif;
  font-size:13px;
  border-radius:10px;
  box-shadow:0 0 20px rgba(0,0,0,0.6);
  z-index:999999;
  user-select:none;
  backdrop-filter:blur(8px);
}
#liamHeader{
  padding:8px 10px;
  background:linear-gradient(90deg,#4b6cff,#9b5bff,#ff4bcf);
  border-radius:10px 10px 0 0;
  cursor:move;
  display:flex;
  align-items:center;
  justify-content:space-between;
  animation:liamRGB 6s linear infinite;
}
#liamTitle{
  font-weight:600;
}
#liamClose{
  cursor:pointer;
  padding:2px 6px;
  border-radius:4px;
}
#liamClose:hover{
  background:rgba(0,0,0,0.3);
}
#liamTabs{
  display:flex;
  border-bottom:1px solid #222;
}
.liamTab{
  flex:1;
  text-align:center;
  padding:6px 0;
  cursor:pointer;
  border-bottom:2px solid transparent;
  transition:.15s;
}
.liamTab.active{
  border-bottom-color:#4b6cff;
  color:#fff;
}
#liamBody{
  padding:8px 10px 10px;
  max-height:380px;
  overflow-y:auto;
}
.liamRow{
  display:flex;
  align-items:center;
  justify-content:space-between;
  margin:4px 0;
  gap:6px;
}
.liamLabel{
  flex:1;
}
.liamToggle{
  width:32px;
  height:16px;
  border-radius:999px;
  background:#333;
  position:relative;
  cursor:pointer;
  transition:.15s;
}
.liamToggleKnob{
  position:absolute;
  top:2px;
  left:2px;
  width:12px;
  height:12px;
  border-radius:50%;
  background:#bbb;
  transition:.15s;
}
.liamToggle.on{
  background:#4b6cff;
}
.liamToggle.on .liamToggleKnob{
  left:18px;
  background:#fff;
}
.liamSlider{
  flex:1;
}
.liamButton{
  padding:3px 8px;
  border-radius:4px;
  border:none;
  background:#333;
  color:#eee;
  cursor:pointer;
  font-size:12px;
  transition:.15s;
}
.liamButton:hover{
  background:#4b6cff;
}
#liamConsole{
  width:100%;
  height:110px;
  background:#050509;
  border-radius:6px;
  border:1px solid #222;
  padding:4px;
  font-family:monospace;
  font-size:11px;
  color:#9fdf9f;
  resize:none;
}
@keyframes liamRGB{
  0%{filter:hue-rotate(0deg);}
  100%{filter:hue-rotate(360deg);}
}
`;
    document.head.appendChild(style);

    /********************
     * PANEL UI
     ********************/
    const panel = document.createElement("div");
    panel.id = "liamClient";
    panel.innerHTML = `
<div id="liamHeader">
  <div id="liamTitle">Liam Client v2 – Safe Pack</div>
  <div id="liamClose">✕</div>
</div>
<div id="liamTabs">
  <div class="liamTab active" data-tab="visual">Visual</div>
  <div class="liamTab" data-tab="movement">Movement</div>
  <div class="liamTab" data-tab="gameplay">Gameplay</div>
  <div class="liamTab" data-tab="console">Console</div>
</div>
<div id="liamBody"></div>
`;
    document.body.appendChild(panel);

    const body = panel.querySelector("#liamBody");
    let consoleBox = null;

    panel.querySelector("#liamClose").onclick = () => panel.remove();

    // Drag
    (function drag(panel, handle) {
        let down = false, ox = 0, oy = 0;
        handle.addEventListener("mousedown", e => {
            down = true;
            ox = e.clientX - panel.offsetLeft;
            oy = e.clientY - panel.offsetTop;
            document.body.style.userSelect = "none";
        });
        addEventListener("mouseup", () => {
            down = false;
            document.body.style.userSelect = "";
        });
        addEventListener("mousemove", e => {
            if (!down) return;
            panel.style.left = (e.clientX - ox) + "px";
            panel.style.top = (e.clientY - oy) + "px";
        });
    })(panel, panel.querySelector("#liamHeader"));

    function log(msg) {
        if (!consoleBox) consoleBox = document.getElementById("liamConsole");
        if (consoleBox) {
            const t = new Date().toLocaleTimeString();
            consoleBox.value += `[${t}] ${msg}\n`;
            consoleBox.scrollTop = consoleBox.scrollHeight;
        }
    }

    const tabs = panel.querySelectorAll(".liamTab");
    tabs.forEach(t => t.onclick = () => {
        tabs.forEach(a => a.classList.remove("active"));
        t.classList.add("active");
        loadTab(t.dataset.tab);
    });

    function makeToggle(id, initial, onChange) {
        const el = document.getElementById(id);
        if (!el) return;
        if (initial) el.classList.add("on");
        el.onclick = () => {
            el.classList.toggle("on");
            const state = el.classList.contains("on");
            onChange(state);
        };
    }

    function loadTab(name) {
        if (name === "visual") {
            body.innerHTML = `
<div class="liamRow">
  <div class="liamLabel">FPS Counter</div>
  <button class="liamButton" id="toggleFPS">Toggle</button>
</div>
<div class="liamRow">
  <div class="liamLabel">Crosshair</div>
  <div class="liamToggle" id="toggleCrosshair"><div class="liamToggleKnob"></div></div>
</div>
<div class="liamRow">
  <div class="liamLabel">Player Tracer</div>
  <div class="liamToggle" id="toggleTracer"><div class="liamToggleKnob"></div></div>
</div>
<div class="liamRow">
  <div class="liamLabel">Glow Trail</div>
  <div class="liamToggle" id="toggleTrail"><div class="liamToggleKnob"></div></div>
</div>
`;
            document.getElementById("toggleFPS").onclick = () => {
                if (window.liamHooks.fpsEnabled) {
                    LiamAPI.disableFPS();
                    log("FPS disabled");
                } else {
                    LiamAPI.enableFPS();
                    log("FPS enabled");
                }
            };
            makeToggle("toggleCrosshair", crosshairEnabled, v => {
                crosshairEnabled = v;
                log("Crosshair " + (v ? "enabled" : "disabled"));
            });
            makeToggle("toggleTracer", tracerEnabled, v => {
                tracerEnabled = v;
                log("Tracer " + (v ? "enabled" : "disabled"));
            });
            makeToggle("toggleTrail", trailEnabled, v => {
                trailEnabled = v;
                log("Glow trail " + (v ? "enabled" : "disabled"));
            });
        }

        if (name === "movement") {
            body.innerHTML = `
<div class="liamRow">
  <div class="liamLabel">Fly Mode</div>
  <div class="liamToggle" id="flyToggle"><div class="liamToggleKnob"></div></div>
</div>
<div class="liamRow">
  <div class="liamLabel">Fly Speed</div>
  <input type="range" id="flySpeed" class="liamSlider" min="1" max="25" value="${flySpeed}">
</div>
<div class="liamRow">
  <div class="liamLabel">Speed Multiplier</div>
  <input type="range" id="speedMult" class="liamSlider" min="1" max="5" step="0.1" value="${speedMult}">
</div>
<div class="liamRow">
  <div class="liamLabel">Slow‑motion</div>
  <input type="range" id="slowmoMult" class="liamSlider" min="0.2" max="1" step="0.05" value="${slowmoMult}">
</div>
<div class="liamRow">
  <div class="liamLabel">No‑clip</div>
  <div class="liamToggle" id="noClipToggle"><div class="liamToggleKnob"></div></div>
</div>
<div class="liamRow">
  <div class="liamLabel">Teleport to cursor</div>
  <div class="liamToggle" id="tpToggle"><div class="liamToggleKnob"></div></div>
</div>
<p style="font-size:11px;opacity:0.8;margin-top:4px;">Fly: WASD + Space/Shift. Teleport: click when enabled.</p>
`;
            makeToggle("flyToggle", flyEnabled, v => {
                flyEnabled = v;
                log("Fly mode " + (v ? "enabled" : "disabled"));
            });
            document.getElementById("flySpeed").oninput = e => {
                flySpeed = +e.target.value;
                log("Fly speed set to " + flySpeed);
            };
            document.getElementById("speedMult").oninput = e => {
                speedMult = +e.target.value;
                log("Speed multiplier set to " + speedMult.toFixed(2));
            };
            document.getElementById("slowmoMult").oninput = e => {
                slowmoMult = +e.target.value;
                log("Slow‑motion factor set to " + slowmoMult.toFixed(2));
            };
            makeToggle("noClipToggle", noClipEnabled, v => {
                noClipEnabled = v;
                log("No‑clip " + (v ? "enabled" : "disabled"));
            });
            makeToggle("tpToggle", teleportMode, v => {
                teleportMode = v;
                log("Teleport mode " + (v ? "enabled" : "disabled"));
            });
        }

        if (name === "gameplay") {
            body.innerHTML = `
<div class="liamRow">
  <div class="liamLabel">Gravity Scale</div>
  <input type="range" id="gravScale" class="liamSlider" min="0.2" max="2" step="0.1" value="${gravityScale}">
</div>
<div class="liamRow">
  <div class="liamLabel">Friction Scale</div>
  <input type="range" id="fricScale" class="liamSlider" min="0.2" max="2" step="0.1" value="${frictionScale}">
</div>
<div class="liamRow">
  <div class="liamLabel">Slope Scale</div>
  <input type="range" id="slopeScale" class="liamSlider" min="0.5" max="2" step="0.1" value="${slopeScale}">
</div>
<div class="liamRow">
  <div class="liamLabel">Auto‑reset if falling</div>
  <div class="liamToggle" id="autoResetToggle"><div class="liamToggleKnob"></div></div>
</div>
`;
            document.getElementById("gravScale").oninput = e => {
                gravityScale = +e.target.value;
                log("Gravity scale set to " + gravityScale.toFixed(2));
            };
            document.getElementById("fricScale").oninput = e => {
                frictionScale = +e.target.value;
                log("Friction scale set to " + frictionScale.toFixed(2));
            };
            document.getElementById("slopeScale").oninput = e => {
                slopeScale = +e.target.value;
                log("Slope scale set to " + slopeScale.toFixed(2));
            };
            makeToggle("autoResetToggle", autoResetEnabled, v => {
                autoResetEnabled = v;
                log("Auto‑reset " + (v ? "enabled" : "disabled"));
            });
        }

        if (name === "console") {
            body.innerHTML = `<textarea id="liamConsole"></textarea>`;
            consoleBox = document.getElementById("liamConsole");
            log("Console ready.");
        }
    }

    loadTab("visual");

    /********************
     * TELEPORT CLICK HANDLER
     ********************/
    window.addEventListener("click", e => {
        if (!teleportMode) return;
        if (!window.slopeGame || !window.slopeGame.player) return;
        const p = window.slopeGame.player;
        p.x = e.clientX;
        p.y = e.clientY;
        log(`Teleported to (${p.x.toFixed(0)}, ${p.y.toFixed(0)})`);
    });

    /********************
     * GAME LOOP HOOKS
     ********************/
    (function flyLoop() {
        try {
            if (flyEnabled && window.slopeGame && window.slopeGame.player) {
                const p = window.slopeGame.player;
                if ("vx" in p) p.vx = 0;
                if ("vy" in p) p.vy = 0;
                if (flyKeys.w) p.y -= flySpeed;
                if (flyKeys.s) p.y += flySpeed;
                if (flyKeys.a) p.x -= flySpeed;
                if (flyKeys.d) p.x += flySpeed;
                if (flyKeys.space) p.y -= 1.2 * flySpeed;
                if (flyKeys.shift) p.y += 1.2 * flySpeed;
            }

            if (window.slopeGame && window.slopeGame.player) {
                const p = window.slopeGame.player;

                // Speed / slow‑mo
                if ("vx" in p) p.vx *= speedMult * slowmoMult;
                if ("vy" in p) p.vy *= speedMult * slowmoMult;

                // No‑clip (simple: disable collision flag if exists)
                if (noClipEnabled && "collides" in p) {
                    p.collides = false;
                }

                // Auto‑reset if falling too low
                if (autoResetEnabled && p.y > innerHeight + 200) {
                    if (typeof p.reset === "function") p.reset();
                    else {
                        p.x = innerWidth / 2;
                        p.y = innerHeight / 2;
                        if ("vx" in p) p.vx = 0;
                        if ("vy" in p) p.vy = 0;
                    }
                    log("Auto‑reset triggered (falling).");
                }

                // Gravity / friction / slope scaling hooks (if your engine exposes them)
                if (window.slopeGame.physics) {
                    const phys = window.slopeGame.physics;
                    if ("gravity" in phys) phys.gravityBase = phys.gravityBase || phys.gravity;
                    if ("friction" in phys) phys.frictionBase = phys.frictionBase || phys.friction;
                    if ("slope" in phys) phys.slopeBase = phys.slopeBase || phys.slope;

                    if ("gravityBase" in phys) phys.gravity = phys.gravityBase * gravityScale;
                    if ("frictionBase" in phys) phys.friction = phys.frictionBase * frictionScale;
                    if ("slopeBase" in phys) phys.slope = phys.slopeBase * slopeScale;
                }
            }
        } catch (e) {}
        requestAnimationFrame(flyLoop);
    })();
})();
