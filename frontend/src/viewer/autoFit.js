import * as THREE from '../../libs/three.module.js';

export function frameObject(object, camera, controls) {
    const box = new THREE.Box3().setFromObject(object);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());

    object.position.sub(center);

    const maxDim = Math.max(size.x, size.y, size.z);
    const fov = camera.fov * Math.PI / 180;
    const aspect = camera.aspect;

    const fitHeight = maxDim / (2 * Math.tan(fov / 2));
    const fitWidth = fitHeight / aspect;

    const distance = Math.max(fitHeight, fitWidth);

    camera.position.set(distance * 0.8, distance * 0.8, distance * 1.2);

    controls.target.set(0, 0, 0);
    controls.update();

    camera.lookAt(0, 0, 0);
}