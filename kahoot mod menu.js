// ===============================
// iiStupid 2.0 — NUCLEAR + ANIMATION FINAL BUILD
// ===============================

// Wrapper
const wrapper = document.createElement("div");
wrapper.style.position = "fixed";
wrapper.style.top = "100px";
wrapper.style.left = "100px";
wrapper.style.display = "flex";
wrapper.style.flexDirection = "row";
wrapper.style.alignItems = "center";
wrapper.style.gap = "20px";
wrapper.style.zIndex = "999999";
document.body.appendChild(wrapper);

// ===============================
// Disconnect Button
// ===============================
const disconnectBtn = document.createElement("button");
disconnectBtn.innerText = "Disconnect";
disconnectBtn.style.position = "absolute";
disconnectBtn.style.top = "-60px";
disconnectBtn.style.left = "50%";
disconnectBtn.style.transform = "translateX(-50%)";
disconnectBtn.style.padding = "10px 20px";
disconnectBtn.style.background = "orange";
disconnectBtn.style.border = "2px solid black";
disconnectBtn.style.color = "white";
disconnectBtn.style.fontSize = "18px";
disconnectBtn.style.cursor = "pointer";
disconnectBtn.style.boxShadow = "0 4px 0 #b85c00";
disconnectBtn.onclick = () => {
    const newTab = window.open("about:blank", "_self");
    newTab.close();
};
wrapper.appendChild(disconnectBtn);

// ===============================
// Sidebar
// ===============================
const sidebar = document.createElement("div");
sidebar.style.width = "160px";
sidebar.style.background = "orange";
sidebar.style.border = "3px solid black";
sidebar.style.padding = "10px";
sidebar.style.display = "flex";
sidebar.style.flexDirection = "column";
sidebar.style.alignItems = "center";
sidebar.style.gap = "10px";
sidebar.style.boxShadow = "0 0 10px rgba(0,0,0,0.4)";
wrapper.appendChild(sidebar);

function makeSidebarButton(text, onClick) {
    const btn = document.createElement("button");
    btn.innerText = text;
    btn.style.width = "100%";
    btn.style.padding = "12px 0";
    btn.style.background = "orange";
    btn.style.border = "2px solid black";
    btn.style.color = text === "OVERPOWERED" ? "red" : "white";
    btn.style.fontSize = "18px";
    btn.style.cursor = "pointer";
    btn.style.boxShadow = "0 4px 0 #b85c00";
    btn.onmousedown = () => (btn.style.transform = "translateY(2px)");
    btn.onmouseup = () => (btn.style.transform = "translateY(0)");
    btn.onclick = onClick;
    return btn;
}

sidebar.appendChild(makeSidebarButton("<", () => scrollPanel(-100)));
sidebar.appendChild(makeSidebarButton(">", () => scrollPanel(100)));
sidebar.appendChild(makeSidebarButton("Join Discord", () => window.open("https://discord.gg/yourinvite")));
sidebar.appendChild(makeSidebarButton("Settings", () => showPanel("settings")));
sidebar.appendChild(makeSidebarButton("Favorite Mods", () => showPanel("favorites")));
sidebar.appendChild(makeSidebarButton("Room Mods", () => showPanel("room")));
sidebar.appendChild(makeSidebarButton("Important Mods", () => showPanel("important")));
sidebar.appendChild(makeSidebarButton("Safety Mods", () => showPanel("safety")));
sidebar.appendChild(makeSidebarButton("OVERPOWERED", () => showOPWarning()));

// ===============================
// Main Menu
// ===============================
const mainMenu = document.createElement("div");
mainMenu.style.width = "400px";
mainMenu.style.height = "500px";
mainMenu.style.background = "orange";
mainMenu.style.border = "3px solid black";
mainMenu.style.padding = "10px";
mainMenu.style.position = "relative";
mainMenu.style.boxShadow = "0 0 10px rgba(0,0,0,0.4)";
wrapper.appendChild(mainMenu);

// Title
const title = document.createElement("div");
title.innerText = "iiStupid 2.0";
title.style.fontSize = "28px";
title.style.fontWeight = "bold";
title.style.color = "white";
title.style.textAlign = "center";
title.style.marginBottom = "10px";
title.style.cursor = "move";
mainMenu.appendChild(title);

// FPS
const fps = document.createElement("div");
fps.innerText = "FPS: 90";
fps.style.fontSize = "18px";
fps.style.color = "white";
fps.style.textAlign = "center";
fps.style.marginBottom = "10px";
mainMenu.appendChild(fps);

// ===============================
// Panel container + SHADOW DOM + NUCLEAR FIX
// ===============================
const panelContainer = document.createElement("div");
mainMenu.appendChild(panelContainer);

// ERASE ALL inherited styles
panelContainer.style.all = "unset";

// Reapply only what we want
panelContainer.style.display = "block";
panelContainer.style.width = "100%";
panelContainer.style.height = "400px";
panelContainer.style.overflowY = "auto";
panelContainer.style.border = "2px solid black";
panelContainer.style.background = "#ffb347";
panelContainer.style.padding = "0";
panelContainer.style.boxSizing = "border-box";

// Allow scroll ONLY
panelContainer.style.pointerEvents = "auto";

// Shadow DOM
const shadow = panelContainer.attachShadow({ mode: "open" });

const shadowContent = document.createElement("div");
shadowContent.style.padding = "10px";
shadowContent.style.color = "white";
shadowContent.style.fontSize = "20px";
shadowContent.style.lineHeight = "26px";
shadowContent.style.userSelect = "none";
shadow.appendChild(shadowContent);

// ===============================
// ANIMATION + OUTLINE STYLE
// ===============================
const shadowStyle = document.createElement("style");
shadowStyle.textContent = `
    /* Outer wrapper receives clicks */
    .modWrap {
        pointer-events: auto !important;
        margin: 4px 0;
        padding: 4px 6px;
        border: 2px solid black;
        border-radius: 4px;
        transition: transform 0.1s ease, background 0.1s ease;
    }

    /* Click animation */
    .modWrap:active {
        transform: translateY(2px);
        background: rgba(0,0,0,0.2);
    }

    /* Inner text stays protected */
    .modItem {
        pointer-events: none !important;
        color: white;
        font-size: 20px;
        line-height: 24px;
        background: none !important;
        border: none !important;
        box-shadow: none !important;
        cursor: default !important;
    }
`;
shadow.appendChild(shadowStyle);

// ===============================
// Panels
// ===============================
const panels = {};

function mod(text) {
    return `
        <div class="modWrap">
            <div class="modItem">${text}</div>
        </div>
    `;
}

panels.settings = `
    <h2>Settings</h2>
    ${mod("Toggle UI Theme")}
    ${mod("Toggle Rainbow Mode")}
    ${mod("Toggle Button Glow")}
    ${mod("Toggle FPS Boost")}
    ${mod("Toggle Auto-Scroll")}
    ${mod("Toggle Smooth Drag")}
`;

panels.favorites = `
    <h2>Favorite Mods</h2>
    ${mod("Fly")}
    ${mod("Noclip")}
    ${mod("ESP")}
    ${mod("Wall Climb")}
    ${mod("Long Arms")}
    ${mod("Speed Boost")}
    ${mod("Super Jump")}
    ${mod("Auto-Tag")}
    ${mod("Auto-Run")}
`;

panels.room = `
    <h2>Room Mods</h2>
    ${mod("Kick All")}
    ${mod("Mute All")}
    ${mod("Freeze Room")}
    ${mod("Slow Motion")}
    ${mod("Fast Motion")}
    ${mod("Reverse Gravity")}
    ${mod("Spawn Objects")}
    ${mod("Delete Objects")}
    ${mod("Force Respawn")}
`;

panels.important = `
    <h2>Important Mods</h2>
    ${mod("Anti-Lag")}
    ${mod("Anti-Crash")}
    ${mod("Auto-Reconnect")}
    ${mod("Auto-Save")}
    ${mod("Safe Mode")}
    ${mod("FPS Stabilizer")}
    ${mod("Network Cleaner")}
    ${mod("Memory Cleaner")}
`;

panels.safety = `
    <h2>Safety Mods</h2>
    ${mod("Anti-Ban")}
    ${mod("Anti-Kick")}
    ${mod("Anti-Report")}
    ${mod("Ghost Mode")}
    ${mod("Hide Username")}
    ${mod("Hide Cosmetics")}
    ${mod("Fake Ping")}
    ${mod("Fake Disconnect")}
`;

panels.overpowered = `
    <h2 style="color:red;">OVERPOWERED MODS</h2>
    <p>Use these at your own risk.</p>
    ${mod("Godmode")}
    ${mod("Infinite Jump")}
    ${mod("Speed x100")}
    ${mod("Teleport Anywhere")}
    ${mod("Explode Map")}
    ${mod("Freeze All Players")}
    ${mod("Crash Room")}
    ${mod("Invisible Mode")}
    ${mod("Force Host")}
    ${mod("Unlock Everything")}
`;

// ===============================
// Panel logic
// ===============================
function showPanel(name) {
    shadowContent.innerHTML = panels[name];
}

function scrollPanel(amount) {
    panelContainer.scrollTop += amount;
}

function showOPWarning() {
    alert("⚠️ WARNING: These mods are extremely overpowered.\nUse at your own risk.");
    showPanel("overpowered");
}

showPanel("settings");

// ===============================
// Dragging
// ===============================
let dragging = false;
let offsetX = 0;
let offsetY = 0;

title.addEventListener("mousedown", (e) => {
    dragging = true;
    offsetX = e.clientX - wrapper.offsetLeft;
    offsetY = e.clientY - wrapper.offsetTop;
});

document.addEventListener("mouseup", () => (dragging = false));

document.addEventListener("mousemove", (e) => {
    if (dragging) {
        wrapper.style.left = e.clientX - offsetX + "px";
        wrapper.style.top = e.clientY - offsetY + "px";
    }
});

// ===============================
// Resize
// ===============================
const resizeHandle = document.createElement("div");
resizeHandle.style.width = "20px";
resizeHandle.style.height = "20px";
resizeHandle.style.background = "black";
resizeHandle.style.position = "absolute";
resizeHandle.style.right = "0";
resizeHandle.style.bottom = "0";
resizeHandle.style.cursor = "nwse-resize";
mainMenu.appendChild(resizeHandle);

let resizing = false;

resizeHandle.addEventListener("mousedown", () => (resizing = true));
document.addEventListener("mouseup", () => (resizing = false));

document.addEventListener("mousemove", (e) => {
    if (resizing) {
        mainMenu.style.width =
            e.clientX - mainMenu.getBoundingClientRect().left + "px";
        mainMenu.style.height =
            e.clientY - mainMenu.getBoundingClientRect().top + "px";
    }
});
