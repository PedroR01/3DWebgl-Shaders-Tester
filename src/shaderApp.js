import * as THREE from "three";
import { useCamera, useScene, useUniformData } from "./lib/init.js";
import fragmentShader from "./shaders/fragment.glsl";
import vertexShader from "./shaders/vertex.glsl";
import GEOMETRY_DATA from "./data/geometryShapes.json";

let mesh = null;
let currentParams = [];

export const shaderVanillaApp = () => {
  const scene = useScene();
  const camera = useCamera();
  const uniformData = useUniformData();

  // Iluminación
  const dirLight = new THREE.DirectionalLight("#526cff", 0.6);
  dirLight.position.set(2, 2, 2);
  const ambientLight = new THREE.AmbientLight("#4255ff", 0.5);
  scene.add(dirLight, ambientLight);

  scene.add(new THREE.AxesHelper(16));

  // Material único reutilizable
  const material = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    wireframe: true,
    uniforms: uniformData,
  });
  // Inicialización con BoxGeometry
  const defaultGeometry = Object.keys(GEOMETRY_DATA.Basics[0])[0];
  currentParams = JSON.parse(
    JSON.stringify(GEOMETRY_DATA.Basics[0][defaultGeometry]),
  );

  const geometry = new THREE[defaultGeometry](
    ...currentParams.map((p) => p.value),
  );
  mesh = new THREE.Mesh(geometry, material);

  scene.add(mesh);
  camera.position.z = 20;

  initGeometryUI(defaultGeometry);
};

/**
 * Inicializa los controles y UI para modificar la geometria en tiempo real
 *
 */
const initGeometryUI = (geometry) => {
  const container = document.getElementById("slider-container");
  const select = document.createElement("select");
  select.className = "geometry-select";

  // Incluyo como opciones todas las geometrias que voy adaptando para visualizar.
  GEOMETRY_DATA.Basics.forEach((item) => {
    const type = Object.keys(item)[0];
    // console.log(type);
    const opt = document.createElement("option");
    opt.value = type;
    opt.text = type.replace("Geometry", "");
    if (type === geometry) opt.selected = true;
    select.appendChild(opt);
  });

  container.appendChild(select);

  // Contenedor para sliders. Facilita su borrado.
  const paramsWrapper = document.createElement("div");
  paramsWrapper.id = "params-wrapper";
  container.appendChild(paramsWrapper);

  renderSliders(geometry, paramsWrapper);

  select.addEventListener("change", (e) => {
    const type = e.target.value;
    const geoData = GEOMETRY_DATA.Basics.find((obj) => obj[type])[type]; // Optimizacion: Aca ya me perdi como refiero y ubico los datos del JSON
    currentParams = JSON.parse(JSON.stringify(geoData));

    renderSliders(type, paramsWrapper);
    updateMesh(type);
  });
};

const renderSliders = (geometryType, container) => {
  container.innerHTML = ""; // Limpiar sliders anteriores

  currentParams.forEach((param, index) => {
    const row = document.createElement("div");
    row.className = "param-row";

    const labelName = document.createElement("label");
    labelName.innerText = `${param.name}: `;
    labelName.className = "param-label";

    const slider = document.createElement("input");
    slider.type = "range";
    slider.min = "1";
    slider.max = "128";
    slider.value = param.value;

    const sliderValue = document.createElement("span");
    sliderValue.innerText = param.value;

    // Antes lo tenía con change, pero habia que soltar para aplicar cambios del slider. De esta forma sigue los valores del slider siempre que se mantenga el click. Tiene mejor experiencia y reacción, pero demanda más procesamiento y recursos.
    slider.addEventListener("input", (e) => {
      const newValue = parseFloat(e.target.value);
      currentParams[index].value = newValue;
      sliderValue.innerText = newValue;

      updateMesh(geometryType);
    });

    row.append(labelName, slider, sliderValue);
    container.appendChild(row);
  });
};

const updateMesh = (geometryType) => {
  if (!mesh) return;

  // Limpiar geometría vieja para evitar leaks de memoria
  if (mesh.geometry) mesh.geometry.dispose();

  // Crear nueva geometría dinámicamente (antes usaba eval() --> Altamente peligroso por vulnerabilidad a inyección de código malicioso).
  try {
    const values = currentParams.map((p) => p.value);
    mesh.geometry = new THREE[geometryType](...values);
  } catch (error) {
    console.error("Error creando geometría:", error); // Optimización: Hacer un toast o popup aclarando el error al usuario.
  }
};
