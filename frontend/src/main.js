import * as THREE from '../libs/three.module.js';
import { OrbitControls } from '../libs/controls/OrbitControls.js';
import { GLTFLoader } from '../libs/loaders/GLTFLoader.js';

import { createScene } from './viewer/scene.js';
import { createCamera } from './viewer/camera.js';
import { frameObject } from './viewer/autoFit.js';
import { LoadingRing } from './viewer/ui/LoadingRing.js';

// =========================
// CORE SETUP
// =========================
const scene = createScene();
const camera = createCamera();

const canvas = document.querySelector("#webgl");

const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true
});

// 🔥 VIKTIGT: använd canvas storlek
// const width = canvas.clientWidth;
// const height = canvas.clientHeight;

// renderer.setSize(width, height, false);

// renderer.setSize(window.innerWidth, window.innerHeight);


function resizeRendererToContainer() {
    const rect = canvas.getBoundingClientRect();

    renderer.setSize(rect.width, rect.height, false);

    camera.aspect = rect.width / rect.height;
    camera.updateProjectionMatrix();
}

resizeRendererToContainer();

renderer.setPixelRatio(window.devicePixelRatio);

// 🔥 FÄRG / TONEMAPPING (UPPDATERAD FIX)
renderer.outputColorSpace = THREE.SRGBColorSpace; // Ändrat från outputEncoding / sRGBEncoding
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.5;

// =========================
// 🔥 ENVIRONMENT (KRITISK FIX)
// =========================
const pmremGenerator = new THREE.PMREMGenerator(renderer);
pmremGenerator.compileEquirectangularShader();

new THREE.TextureLoader().load('/env.jpg', (texture) => {
    texture.mapping = THREE.EquirectangularReflectionMapping;
    
    // Om din /env.jpg ser blek ut, kan du behöva lägga till raden nedan:
    // texture.colorSpace = THREE.SRGBColorSpace; 

    const envMap = pmremGenerator.fromEquirectangular(texture).texture;

    scene.environment = envMap;

    // valfri (visa bakgrund)
    // scene.background = envMap;
});

// =========================
// LIGHTS (fallback)
// =========================
const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 1.5);
scene.add(hemiLight);

// =========================
// CONTROLS
// =========================
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// =========================
// LOADING UI
// =========================
const loadingCanvas = document.getElementById("loadingCanvas");
const loaderUI = new LoadingRing(loadingCanvas);

// =========================
// STATE
// =========================
let currentModel = null;

// =========================
// LOAD MODEL
// =========================
const loader = new GLTFLoader();

loader.load(
    "/model.glb",

    (gltf) => {
        const model = gltf.scene;
        scene.add(model);

        currentModel = model;

        // DEBUG: log materials
        model.traverse((child) => {
            if (child.isMesh) {
                console.log(child.material);
            }
        });

        frameObject(model, camera, controls);

        loaderUI.setProgress(100);

        setTimeout(() => {
            loadingCanvas.style.display = "none";
        }, 400);
    },

    (xhr) => {
        if (xhr.total) {
            loaderUI.setProgress((xhr.loaded / xhr.total) * 100);
        }
    },

    (error) => {
        console.error(error);
        loaderUI.setProgress(100);
    }
);

// =========================
// RESIZE
// =========================
window.addEventListener("resize", () => {
    // camera.aspect = window.innerWidth / window.innerHeight;
    // camera.updateProjectionMatrix();

    // renderer.setSize(window.innerWidth, window.innerHeight);
    resizeRendererToContainer();

    if (currentModel) {
        frameObject(currentModel, camera, controls);
    }
});

// =========================
// RENDER LOOP
// =========================
function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}

animate();