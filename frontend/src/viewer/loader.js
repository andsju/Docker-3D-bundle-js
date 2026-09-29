import { GLTFLoader } from '../../libs/loaders/GLTFLoader.js';

export function loadModel(url, scene, onProgress, onComplete) {
    const loader = new GLTFLoader();

    loader.load(
        url,
        (gltf) => {
            scene.add(gltf.scene);
            onComplete(gltf.scene);
        },
        onProgress,
        (err) => console.error(err)
    );
}