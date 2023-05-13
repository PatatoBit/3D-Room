import Experience from "../experience";
import Room from "./room";
import Environment from "./environment";

export default class World {
  experience: Experience;
  environment!: Environment;
  scene: Experience["scene"];
  resources: Experience["resources"];

  room!: Room;

  constructor() {
    this.experience = new Experience(null);
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;

    this.resources.on("loaded", () => {
      console.log("Resources ready");
      // this.floor = new Floor();
      // this.fox = new Fox();
      this.room = new Room();
      this.environment = new Environment();
    });
  }
}
