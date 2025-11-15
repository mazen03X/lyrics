import * as THREE from 'three';
import { Text,configureTextBuilder } from "troika-three-text";
configureTextBuilder({ gpuAccelerateSDF: true });  // Experimental but helps Arabic
//import {reshape} from "./node_modules/js-arabic-reshaper/index.js";
//const reshaped = reshape("./node_modules/js-arabic-reshaper/index.js");
import {reshape} from "./arReshaper.js";

//import { reshape } from 'js-arabic-reshaper';


window.THREE = THREE;

window.lyricSettings = {
  currentSize: 0.6,
  previewSize: 0.3,
  currentColor: "#32CD32",
  previewColor: "#FFFFFF",
  currentOffsetY: 0,
  previewOffsetY: -2,
  currentSpacing: 0.6,
  previewSpacing: 0.5,
  currentMaxWidth: 80,
  previewMaxWidth: 20
};


const canvas = document.querySelector('#c');
const renderer = new THREE.WebGLRenderer({ antialias: true, canvas });

const scene = new THREE.Scene();
window.scene = scene;
window.renderer = renderer;

const boxWidth = 1;
const boxHeight = 1;
const boxDepth = 1;
const material = new THREE.MeshPhongMaterial({ color: 0xff0000 });
const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);
const cube = new THREE.Mesh(geometry, material);
//scene.add(cube);


function pickFont(text) {
  const arabicRegex = /[\u0600-\u06FF]/;
  return arabicRegex.test(text) ? "./NotoSansArabic-Regular.ttf" : "./VendSans-Light.ttf";
}
function createTextMesh(line, size, color, maxWidth, lineHeight) {
  const textMesh = new Text();

  const arabicRegex = /[\u0600-\u06FF]/;
  let shapedLine = line;
  if (arabicRegex.test(line)) {
    shapedLine = reshape(line);
  }

  textMesh.text = shapedLine;
  textMesh.font = pickFont(line);
  textMesh.fontSize = size;
  textMesh.color = new THREE.Color(color);
  textMesh.anchorX = "center";
  textMesh.anchorY = "middle";
  if (maxWidth) textMesh.maxWidth = maxWidth;
  if (lineHeight) textMesh.lineHeight = lineHeight;
  textMesh.overflowWrap = 'break-word';
  textMesh.direction = arabicRegex.test(line) ? 'rtl' : 'auto';

  textMesh.sync();
  return textMesh;
}

let currentLineMesh = null;

function updateLyricsDisplay(currentLine, previewLines, options = {}) {
  if (currentLineMesh) {
    scene.remove(currentLineMesh);
  }

  if (!currentLine && !previewLines.length) return; // Avoid empty updates

  const opts = { ...window.lyricSettings, ...options };
  const {
    currentSize, previewSize,
    currentColor, previewColor,
    currentSpacing, previewSpacing,
    currentOffsetY, previewOffsetY,
    currentMaxWidth, previewMaxWidth
  } = opts;

  const group = new THREE.Group();

  if (currentLine) {
    const mesh = createTextMesh(currentLine, currentSize, currentColor, currentMaxWidth, currentSpacing);
    mesh.position.y = currentOffsetY;
    group.add(mesh);
  }

  let y = previewOffsetY;
  previewLines.forEach((line, idx) => {
    const mesh = createTextMesh(line, previewSize, previewColor, previewMaxWidth, previewSpacing);
    mesh.position.y = y - idx * previewSpacing;
    group.add(mesh);
  });

  currentLineMesh = group;
  scene.add(currentLineMesh);

  window.currentLineMesh = currentLineMesh;
  window.currentLine = currentLine;
  window.firstFive = previewLines;
}

window.updateLyricsDisplay = updateLyricsDisplay;

const fov = 75;
const aspect = 2;
const near = 0.1;
const far = 50;
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
camera.position.z = 5;
window.camera = camera;

let targetColor = new THREE.Color(Math.random() * 0xffffff);

function setNewTarget() {
  targetColor = new THREE.Color(Math.random() * 0xffffff);
  setTimeout(setNewTarget, 2000 + Math.random() * 3000);
}
setNewTarget();

function render(time) {
  time *= 0.001;

  if (resizeRendererToDisplaySize(renderer)) {
    const canvas = renderer.domElement;
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
  }
  cube.material.color.lerp(targetColor, 0.01);

  if (currentLineMesh) {
    currentLineMesh.children.forEach(child => {
      if (child.isMesh) {
        child.material.color.lerp(targetColor, 0.01);
        //child.rotation.y = time;
      }
    });
  }

  renderer.render(scene, camera);
  requestAnimationFrame(render);
}

const color = 0xFFFFFF;
const intensity = 0.4;
const light = new THREE.DirectionalLight(color, intensity);
light.position.set(-1, 2, 4);
scene.add(light);

function resizeRendererToDisplaySize(renderer) {
  const canvas = renderer.domElement;
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  const needResize = canvas.width !== width || canvas.height !== height;
  if (needResize) {
    renderer.setSize(width, height, false);
  }
  return needResize;
}

requestAnimationFrame(render);

const lyric = document.getElementById('lyric');
const next = document.getElementById('next');
const reset = document.getElementById('reset');
const show = document.getElementById('show');
const hide = document.getElementById('hide');

let firstFive = [];
let index = 1;
let currentLine = "";

window.currentLineMesh = currentLineMesh;
window.currentLine = currentLine;
window.firstFive = firstFive;

lyric.addEventListener("input", () => {
  firstFive = lyric.value.split("\n").filter(l => l.trim() !== "").slice(0, 5);
  updateLyricsDisplay("", firstFive, window.lyricSettings);
});

next.addEventListener("click", () => {
  currentLine = firstFive[0] || "";
  firstFive = lyric.value.split("\n").filter(l => l.trim() !== "").slice(index, index + 5);
  if (!firstFive.length && !currentLine) return; // Avoid advancing past end
  index++;
  updateLyricsDisplay(currentLine, firstFive, window.lyricSettings);
});

reset.addEventListener("click", () => {
  firstFive = [];
  index = 1;
  currentLine = "";
  firstFive = lyric.value.split("\n").filter(l => l.trim() !== "").slice(0, 5);
  updateLyricsDisplay(currentLine, firstFive, window.lyricSettings);
});

show.addEventListener("click", () => {
  currentLine = "";
  firstFive = lyric.value.split("\n").filter(l => l.trim() !== "").slice(index - 1, index + 4);
  updateLyricsDisplay(currentLine, firstFive, window.lyricSettings);
});

hide.addEventListener("click", () => {
  currentLine = "";
  firstFive = [];
  updateLyricsDisplay(currentLine, firstFive, window.lyricSettings);
});



document.getElementById("startRec").addEventListener("click", startRecording);
document.getElementById("stopRec").addEventListener("click", stopRecording);
const recDot = document.getElementById("recDot");



let mediaRecorder;
let recordedChunks = [];

function startRecording() {
  const stream = renderer.domElement.captureStream(30); // 30 FPS
  mediaRecorder = new MediaRecorder(stream, { mimeType: "video/webm" });

  mediaRecorder.ondataavailable = (event) => {
    if (event.data.size > 0) {
      recordedChunks.push(event.data);
    }
  };

  mediaRecorder.onstop = () => {
    const blob = new Blob(recordedChunks, { type: "video/webm" });
    const url = URL.createObjectURL(blob);

    // Download automatically
    const a = document.createElement("a");
    a.href = url;
    a.download = "lyrics_recording.webm";
    a.click();

    recordedChunks = [];
  };

  mediaRecorder.start();
  console.log("Recording started");
  recDot.style.backgroundColor = "green";
}

function stopRecording() {
  if (mediaRecorder && mediaRecorder.state !== "inactive") {
    mediaRecorder.stop();
    console.log("Recording stopped");
    recDot.style.backgroundColor = "red";
  }

}


