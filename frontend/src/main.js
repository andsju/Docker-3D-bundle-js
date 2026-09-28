import * as THREE from '../libs/three.module.js';
import { OrbitControls } from '../libs/controls/OrbitControls.js';
import { GLTFLoader } from '../libs/loaders/GLTFLoader.js';

// ==========================
// CORE SETUP
// ==========================
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x111111);

const camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

const canvas = document.querySelector('#webgl');

const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true
});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

// ==========================
// LIGHTS
// ==========================
const light1 = new THREE.DirectionalLight(0xffffff, 1.2);
light1.position.set(5, 10, 5);
scene.add(light1);

const light2 = new THREE.AmbientLight(0xffffff, 0.4);
scene.add(light2);

// ==========================
// CONTROLS
// ==========================
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;

// ==========================
// STATE
// ==========================
let currentModel = null;

// ==========================
// AUTO-FIT CAMERA
// ==========================
function frameObject(object) {
    const box = new THREE.Box3().setFromObject(object);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());

    // centrera modellen
    object.position.sub(center);

    const maxDim = Math.max(size.x, size.y, size.z);

    const fov = camera.fov * Math.PI / 180;
    const aspect = camera.aspect;

    const fitHeight = maxDim / (2 * Math.tan(fov / 2));
    const fitWidth = fitHeight / aspect;

    const distance = Math.max(fitHeight, fitWidth);

    camera.position.set(
        distance * 0.8,
        distance * 0.8,
        distance * 1.2
    );

    controls.target.set(0, 0, 0);
    controls.update();

    camera.lookAt(0, 0, 0);
}

// ==========================
// LOADING RING (CANVAS UI)
// ==========================
const loadingCanvas = document.getElementById('loadingCanvas');
const ctx = loadingCanvas.getContext('2d');

let loadingProgress = 0;
let targetProgress = 0;

function resizeLoadingCanvas() {
    loadingCanvas.width = window.innerWidth;
    loadingCanvas.height = window.innerHeight;
}
resizeLoadingCanvas();

window.addEventListener('resize', resizeLoadingCanvas);

function drawLoadingRing() {
    ctx.clearRect(0, 0, loadingCanvas.width, loadingCanvas.height);

    const x = loadingCanvas.width / 2;
    const y = loadingCanvas.height / 2;
    const radius = 50;

    loadingProgress += (targetProgress - loadingProgress) * 0.08;

    const start = -Math.PI / 2;
    const end = start + (loadingProgress / 100) * Math.PI * 2;

    // background ring
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 8;
    ctx.stroke();

    // progress ring
    ctx.beginPath();
    ctx.arc(x, y, radius, start, end);
    ctx.strokeStyle = '#00ffcc';
    ctx.lineWidth = 8;
    ctx.stroke();

    // text
    ctx.fillStyle = '#fff';
    ctx.font = '16px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`${Math.round(loadingProgress)}%`, x, y);

    requestAnimationFrame(drawLoadingRing);
}

drawLoadingRing();

// ==========================
// MODEL LOADER
// ==========================
const loader = new GLTFLoader();

const MODEL_URL = '/model.glb';

loader.load(
    MODEL_URL,

    (gltf) => {
        const model = gltf.scene;
        scene.add(model);

        currentModel = model;

        frameObject(model);

        targetProgress = 100;

        // hide loading after fade
        setTimeout(() => {
            loadingCanvas.style.display = 'none';
        }, 400);
    },

    (xhr) => {
        if (xhr.total) {
            targetProgress = (xhr.loaded / xhr.total) * 100;
        } else {
            targetProgress = 60;
        }
    },

    (error) => {
        console.error('GLTF error:', error);
        targetProgress = 100;
    }
);

// ==========================
// RESIZE HANDLING
// ==========================
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

    if (currentModel) {
        frameObject(currentModel);
    }
});

// ==========================
// RENDER LOOP
// ==========================
function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}

animate();