"use strict";

import * as THREE from './three.module.js';
import {OrbitControls} from "./OrbitControls.js";
import { GLTFLoader } from "./GLTFLoader.js";
import {AxesHelper, GridHelper, Raycaster, TextureLoader, WebGLRenderer} from './three.module.js';
import {TransformControls} from "./TransformControls.js";


const T = THREE, M = Math, w = window, d = document, PI = Math.PI;
const PI_2 = PI / 2, V3 = T.Vector3, s = new T.Scene();
w['s'] = s;
w['T'] = T;

let renderer, camera, GH, AH, orbitControls, transformControls, parentGroup = new T.Group();
const raycaster = new Raycaster();
const gltfLoader = new GLTFLoader();
const textureLoader = new TextureLoader();

$.extend(gltfLoader, {loaded: 0}); $.extend(textureLoader, {loaded: 0});

// s.add(arrowHelper);
// s.add(space = new T.Mesh(new T.SphereGeometry(800), new T.MeshBasicMaterial()));
// s.add(sphere = new T.Mesh(new T.SphereGeometry(.05), new T.MeshBasicMaterial({ color: 0xe0e020 })));

(function loadObjects() {
    for (let j = 0; j < OBJECTS.length; j++) {
        let file = OBJECTS[j].file;

        gltfLoader.load(`models/${file}.glb`, (loadedObject) => {   //console.log(loadedObject);

            let obj = OBJECTS.find(obj => obj.file === file);

            loadedObject.scene.name = obj.name;

            s.add(loadedObject.scene);

            if (++gltfLoader.loaded === OBJECTS.length) {
                init();
                animate();
            }
        });
    }
})();

// function loadCubeMaps() {
//     CTloader.load( ['right.png', 'left.png', 'top.png', 'bottom.png', 'front.png', 'back.png' ], (cubeMap) => {
//         environmentMap = cubeMap;
//         s.background = environmentMap;
//
//          init();
//         animate();
//     });
// }

function init() {

    s.add(parentGroup);

    s.add(GH = new GridHelper(100, 10, new T.Color(0x333333), new T.Color(0x333333)));  // square size: 10 units
    s.add(AH = new AxesHelper(50)); AH.position.y = .01;

    renderer = new WebGLRenderer({ antialias: true, precision: 'lowp' });  // { canvas: canvas, context: canvas.getContext( 'webgl2' ), antialias: true, precision: 'lowp' }
    renderer.setSize(w.innerWidth, w.innerHeight);

    d.body.appendChild(renderer.domElement);

    addPointLight('backLight', 20 , 165, -10, true, .7, 0x999999);
    addPointLight('frontLight', -20 , 170, 60, true, .7, 0x999999);

    s.add(new T.AmbientLight(0xcccccc));

    camera = new T.PerspectiveCamera(80, w.innerWidth / w.innerHeight, .01, 100000);
    [w].name = 'camera';
    camera.position.set(0, 40, 30);

    orbitControls = new OrbitControls(camera, renderer.domElement);
    transformControls = new TransformControls();

}

// TODO: update just when scene needs it
function animate() {
    renderer.render(s);
    requestAnimationFrame(animate);
}


/**
 * @param {string} varName Global variable name
 * @param {number} posX
 * @param {number} posY
 * @param {number} posZ
 * @param {boolean} helper Add light helper?
 * @param {number} intensity
 * @param {number} color
 * @return {PointLight}
 */
function addPointLight(varName, posX, posY, posZ, helper, intensity, color) {
    helper = helper === undefined ? true : helper;
    intensity = intensity === undefined ? 1 : intensity;
    color = color === undefined ? 0xffffff : color;

    window[varName] = new T.PointLight(color, intensity, 0, 2);  // distance, decay (default 1, phys. correct 2)

    let light = window[varName];

    light.position.set(posX, posY, posZ);

    if (helper)
        s.add(new T.PointLightHelper(light, 10));

    s.add(light);
    return light;
}

w.onresize = () => {
    if (!camera || !renderer)
        return;
    camera.aspect = w.innerWidth / w.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(w.innerWidth, w.innerHeight);
};

//export default { cameraTop }   // FUUUUUUUUUUUUUUUUUUUCK  >>:-(

