import { PerspectiveCamera } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

import Experience from "./experience";

export default class Camera {
  experience: Experience;
  sizes: Experience["sizes"];
  scene: Experience["scene"];
  canvas: Experience["canvas"];
  instance!: PerspectiveCamera;
  controls!: OrbitControls;
  config!: any;
  debug: any;
  debugFolder: any;

  constructor() {
    // this.experience = experience;
    this.experience = new Experience(null);
    this.debug = this.experience.debug;
    this.sizes = this.experience.sizes;
    this.scene = this.experience.scene;
    this.canvas = this.experience.canvas;

    if (this.debug.active) {
      this.debugFolder = this.debug.ui.addFolder("camera");
    }

    this.setInstance();
    this.setConfig();
    this.setOrbitControls();
  }

  setInstance() {
    this.instance = new PerspectiveCamera(
      35,
      this.sizes.width / this.sizes.height,
      0.1,
      100
    );
    this.instance.position.set(5, 3, 5);
    this.instance.rotation.reorder("YXZ");
    this.scene.add(this.instance);
  }

  setConfig() {
    this.config = {};

    // Pixel ratio
    this.config.pixelRatio = Math.min(Math.max(window.devicePixelRatio, 1), 2);

    // Width and height
    const boundings = this.experience.canvas.getBoundingClientRect();
    this.config.width = boundings.width;
    this.config.height = boundings.height || window.innerHeight;
    this.config.smallestSide = Math.min(this.config.width, this.config.height);
    this.config.largestSide = Math.max(this.config.width, this.config.height);

    // Debug
    // this.config.debug = window.location.hash === '#debug'
  }

  setOrbitControls() {
    this.controls = new OrbitControls(this.instance, this.canvas);
    this.controls.enableDamping = true;

    // Limit
    // Cannot look behind the model

    this.controls.maxAzimuthAngle = Math.PI / 2;
    this.controls.minAzimuthAngle = 0;
    this.controls.maxPolarAngle = Math.PI / 2;
    this.controls.minPolarAngle = 0;

    if (this.debug.active) {
      this.debugFolder
        .add(this.controls, "maxAzimuthAngle")
        .name("maxAzimuthAngle")
        .min(-Math.PI)
        .max(Math.PI)
        .step(0.001);
      this.debugFolder
        .add(this.controls, "minAzimuthAngle")
        .name("minAzimuthAngle")
        .min(-Math.PI)
        .max(Math.PI)
        .step(0.001);
      this.debugFolder
        .add(this.controls, "maxPolarAngle")
        .name("maxPolarAngle")
        .min(-Math.PI)
        .max(Math.PI)
        .step(0.001);
      this.debugFolder
        .add(this.controls, "minPolarAngle")
        .name("minPolarAngle")
        .min(-Math.PI)
        .max(Math.PI)
        .step(0.001);
    }
  }

  resize() {
    this.instance.aspect = this.sizes.width / this.sizes.height;
    this.instance.updateProjectionMatrix();
  }

  update() {
    this.controls.update();
  }
}
