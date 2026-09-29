import * as THREE from '../../libs/three.module.js';

export function createScene() {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x111111);
    return scene;
}
