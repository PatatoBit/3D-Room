import { Mesh } from "three";
import Experience from "../experience";

export default class Room {
  experience: Experience;
  scene: Experience["scene"];
  resources: Experience["resources"];

  resource: any;
  model!: Mesh;

  constructor() {
    this.experience = new Experience(null);
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;

    // Setup
    this.resource = this.resources.items.roomModel;
    this.setModel();
  }

  setModel() {
    this.model = this.resource.scene;
    this.scene.add(this.model);

    this.model.traverse((child: any) => {
      if (child instanceof Mesh) {
        child.castShadow = true;
      }
    });
  }
}
