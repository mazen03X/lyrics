// settings.js

// Panel toggle
const settingsBtn = document.getElementById("settingsBtn");
const panel = document.getElementById("settingsPanel");
const header = document.getElementById("settingsHeader");

settingsBtn.addEventListener("click", () => {
  panel.style.display = "block";
});

document.addEventListener("click", (e) => {
  if (
    panel.style.display === "block" &&
    !panel.contains(e.target) &&
    e.target !== settingsBtn
  ) {
    panel.style.display = "none";
  }
});


let isDragging = false;
let offsetX, offsetY;

header.addEventListener("mousedown", (e) => {
  // only drag if clicked on the header or panel itself
  isDragging = true;
  offsetX = e.clientX - panel.offsetLeft;
  offsetY = e.clientY - panel.offsetTop;
});

document.addEventListener("mousemove", (e) => {
  if (isDragging) {
    panel.style.left = (e.clientX - offsetX) + "px";
    panel.style.top = (e.clientY - offsetY) + "px";
  }
});

document.addEventListener("mouseup", () => {
  isDragging = false;
});


// Tabs
const tabButtons = document.querySelectorAll(".tabBtn");
const tabContents = document.querySelectorAll(".tabContent");

tabButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    tabButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    tabContents.forEach(c => c.style.display = "none");
    const target = btn.getAttribute("data-target");
    document.getElementById(target).style.display = "block";
  });
});

// Use the same ID as in HTML
const canvas = document.getElementById("c");

// Resolution controls
document.getElementById("canvasWidth").addEventListener("change", (e) => {
  canvas.width = parseInt(e.target.value);
});

document.getElementById("canvasHeight").addEventListener("change", (e) => {
  canvas.height = parseInt(e.target.value);
});

document.getElementById("canvasDisplay").addEventListener("change", (e) => {
  canvas.style.display = e.target.value;
});

// Quick size presets
document.querySelectorAll(".sizeBtn").forEach(btn => {
  btn.addEventListener("click", () => {
    const w = btn.getAttribute("data-width");
    const h = btn.getAttribute("data-height");
    canvas.style.width = w + "px";
    canvas.style.height = h + "px";
  });
});

// Custom size
document.getElementById("applyCustomSize").addEventListener("click", () => {
  const w = document.getElementById("customWidth").value;
  const h = document.getElementById("customHeight").value;
  canvas.style.width = w + "px";
  canvas.style.height = h + "px";
});

// === Lyric display settings ===

// Background color
document.getElementById("bgColor").addEventListener("input", e => {
  window.scene.background = new THREE.Color(e.target.value);
});

// Current line settings
document.getElementById("currentFontSize").addEventListener("input", e => {
  window.lyricSettings.currentSize = parseFloat(e.target.value);
  window.updateLyricsDisplay(window.currentLine, window.firstFive, window.lyricSettings);
});

document.getElementById("currentFontColor").addEventListener("input", e => {
  window.lyricSettings.currentColor = e.target.value;
  if (window.currentLineMesh) {
    window.currentLineMesh.children.forEach(child => {
      if (child.isMesh && child.userData.type === "current") {
        child.material.color.set(e.target.value);
      }
    });
  }
});

document.getElementById("currentPosY").addEventListener("input", e => {
  window.lyricSettings.currentOffsetY = parseInt(e.target.value);
  window.updateLyricsDisplay(window.currentLine, window.firstFive, window.lyricSettings);
});

// Preview lines settings
document.getElementById("fiveFontSize").addEventListener("input", e => {
  window.lyricSettings.previewSize = parseFloat(e.target.value);
  window.updateLyricsDisplay(window.currentLine, window.firstFive, window.lyricSettings);
});

document.getElementById("fiveFontColor").addEventListener("input", e => {
  window.lyricSettings.previewColor = e.target.value;
  if (window.currentLineMesh) {
    window.currentLineMesh.children.forEach(child => {
      if (child.isMesh && child.userData.type === "preview") {
        child.material.color.set(e.target.value);
      }
    });
  }
});


document.getElementById("fiveStartY").addEventListener("input", e => {
  window.lyricSettings.previewOffsetY = parseInt(e.target.value);
  window.updateLyricsDisplay(window.currentLine, window.firstFive, window.lyricSettings);
});

document.getElementById("fiveSpacing").addEventListener("input", e => {
  window.lyricSettings.previewSpacing = parseInt(e.target.value);
  window.updateLyricsDisplay(window.currentLine, window.firstFive, window.lyricSettings);
});

// Quick presets
document.querySelectorAll(".presetBtn").forEach(btn => {
  btn.addEventListener("click", (e) => {
    const bg = e.currentTarget.dataset.bg;
    const currentColor = e.currentTarget.dataset.currentcolor;
    const previewColor = e.currentTarget.dataset.fivecolor;

    window.scene.background = new THREE.Color(bg);
    window.lyricSettings.currentColor = currentColor;
    window.lyricSettings.previewColor = previewColor;
    window.updateLyricsDisplay(window.currentLine, window.firstFive, window.lyricSettings);
  });
});


//animation settings


document.getElementById("presetCalm").addEventListener("click", () => {
  window.setPreset("calm");
});

document.getElementById("presetEnergetic").addEventListener("click", () => {
  window.setPreset("energetic");
});

document.getElementById("presetWavey").addEventListener("click", () => {
  window.setPreset("wavey");
});

document.getElementById("presetNeon").addEventListener("click", () => {
  window.setPreset("neonGlow");
});

document.getElementById("clearPresets").addEventListener("click", () => {
  window.clearPresets();
});