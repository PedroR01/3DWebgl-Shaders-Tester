import "./style.css";
import { shaderVanillaApp } from "./shaderApp.js";
import { initEngine } from "./lib/init.js";

(async () => {
  await initEngine(); // Starts the mainly components for 3D web implementation with Three.js... Also provides custom hooks to access and modify this components.
  shaderVanillaApp();
})();
