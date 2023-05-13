import Experience from "../experience";
import Environment from "./environment";
import Floor from "./floor";
import Fox from "./fox";

export default class World {
  experience: Experience;
  environment!: Environment;
  scene: Experience["scene"];
  resources: Experience["resources"];

  fox!: Fox;
  floor!: Floor;

  constructor() {
    this.experience = new Experience(null);
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;

    this.resources.on("loaded", () => {
      console.log("Resources ready");
      this.floor = new Floor();
      this.fox = new Fox();
      this.environment = new Environment();
    });
  }

  update() {
    if (this.fox) {
      this.fox.update();
    }
  }
}
