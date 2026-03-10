/**
 * Script for threejs basic elements initialization.
 * Designed with hooks to reference some of these basic elements and their funcionalities.
 */

import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
// import TickManager from "./tick-manager.js";

let scene,
  camera,
  renderer,
  composer,
  controls,
  clock,
  renderWidth,
  renderHeight,
  renderAspectRatio,
  uniformData;
// const renderTickManager = new TickManager();

export const initEngine = async () => {
  scene = new THREE.Scene();

  renderWidth = window.innerWidth;
  renderHeight = window.innerHeight;

  renderAspectRatio = renderWidth / renderHeight;

  camera = new THREE.PerspectiveCamera(75, renderAspectRatio, 0.1, 200);
  camera.position.z = 2;

  renderer = new THREE.WebGLRenderer({ antialias: true });

  renderer.setSize(renderWidth, renderHeight);
  renderer.setPixelRatio(window.devicePixelRatio * 1.5);

  renderer.setClearColor(0x090a0b);

  // shadow
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  document.body.appendChild(renderer.domElement);

  clock = new THREE.Timer();
  uniformData = {
    uTime: {
      type: "f",
      value: clock.getElapsed(),
    },
  };

  const target = new THREE.WebGLRenderTarget(renderWidth, renderHeight, {
    samples: 8,
  });
  composer = new EffectComposer(renderer, target);
  const renderPass = new RenderPass(scene, camera);
  composer.addPass(renderPass);

  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.enablePan = false;

  window.addEventListener(
    "resize",
    () => {
      renderWidth = window.innerWidth;
      renderHeight = window.innerHeight;
      renderAspectRatio = renderWidth / renderHeight;

      renderer.setPixelRatio(window.devicePixelRatio * 1.5);

      camera.aspect = renderAspectRatio;
      camera.updateProjectionMatrix();

      renderer.setSize(renderWidth, renderHeight);
      composer.setSize(renderWidth, renderHeight);
    },
    false,
  );

  function animate(timestamp) {
    requestAnimationFrame(animate);

    // timestamp is optional
    clock.update(timestamp);
    uniformData.uTime.value = clock.getElapsed();

    controls.update();
    composer.render();
    // renderer.render(scene, camera); // No postProcessing. More optimal and simpler than composer.
  }

  renderer.setAnimationLoop(animate);
  // renderTickManager.startLoop(); // More advanced and custom timer handler.
};

export const useRenderer = () => renderer;

export const useRenderSize = () => ({
  width: renderWidth,
  height: renderHeight,
});

export const useScene = () => scene;

export const useCamera = () => camera;

export const useControls = () => controls;

export const useClock = () => clock;

export const useComposer = () => composer;

export const useUniformData = () => uniformData;

export const addPass = (pass) => {
  composer.addPass(pass);
};

// export const useTick = (fn) => {
//   if (renderTickManager) {
//     const _tick = (e) => {
//       fn(e.data);
//     };
//     renderTickManager.addEventListener("tick", _tick);
//   }
// };
