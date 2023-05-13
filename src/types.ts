import { Texture } from "three";

export interface Source {
  name: string;
  type: string;
  path: string[] | string;
}

export interface EnvironmentMapConfig {
  intensity: number;
  texture: Texture;
  updateMaterials: () => void;
}
