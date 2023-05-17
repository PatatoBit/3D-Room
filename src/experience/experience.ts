import { Mesh, Scene } from "three";
import Camera from "./camera";
import Renderer from "./renderer";
import sources from "./sources";
import Debug from "./utils/debug";
import Resources from "./utils/resources";
import Sizes from "./utils/sizes";
import Time from "./utils/time";
import World from "./world/world";

declare global {
  interface Window {
    experience: any;
  }
}

let instance: Experience | null = null;

export default class Experience {
  canvas!: HTMLCanvasElement;
  sizes!: Sizes;
  time!: Time;
  scene!: Scene;
  resources!: Resources;
  camera!: Camera;
  renderer!: Renderer;
  world!: World;
  debug!: any;
  config: any;

  constructor(canvas: HTMLCanvasElement | null) {
    if (instance) {
      return instance;
    }

    instance = this;

    window.experience = this;

    // Options
    this.canvas = canvas!;

    // Setup
    this.debug = new Debug();
    this.sizes = new Sizes();
    this.time = new Time();
    this.scene = new Scene();
    this.resources = new Resources(sources);
    this.camera = new Camera();
    this.renderer = new Renderer();
    this.world = new World();

    console.log(this);

    // Resize event
    this.sizes.on("resize", () => this.resize());
    // Time tick event
    this.time.on("tick", () => this.update());

    this.setConfig();
  }

  init() {}

  resize() {
    // Window resize do what
    this.camera.resize();
    this.renderer.resize();
  }

  update() {
    // Animate
    // this.camera.update();
    this.renderer.update();
  }

  destroy() {
    this.sizes.off("resize");
    this.time.off("tick");

    this.scene.traverse((child) => {
      if (child instanceof Mesh) {
        child.geometry.dispose();

        for (const key in child.material) {
          const value = child.material[key];

          if (value && typeof value.dispose === "function") {
            value.dispose();
          }
        }
      }
    });

    this.camera.controls.dispose();
    this.renderer.instance.dispose();

    if (this.debug.active) {
      this.debug.ui.destroy();
    }
  }

  setConfig() {
    this.config = {};

    // Pixel ratio
    this.config.pixelRatio = Math.min(Math.max(window.devicePixelRatio, 1), 2);

    // Width and height
    const boundings = this.canvas.getBoundingClientRect();
    this.config.width = boundings.width;
    this.config.height = boundings.height || window.innerHeight;
    this.config.smallestSide = Math.min(this.config.width, this.config.height);
    this.config.largestSide = Math.max(this.config.width, this.config.height);

    // Debug
    // this.config.debug = window.location.hash === '#debug'
    this.config.debug = this.config.width > 420;
  }
}
