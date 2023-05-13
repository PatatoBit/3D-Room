import { CubeTexture, CubeTextureLoader, Texture, TextureLoader } from "three";
import { GLTF, GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { Source } from "../../types";
import sources from "../sources";
import EventEmitter from "./eventEmitter";

export default class Resources extends EventEmitter {
  sources: Source[];
  items: typeof sources | any;
  toLoad: number;
  loaded: number;
  loaders!: {
    gltfLoader: GLTFLoader;
    textureLoader: TextureLoader;
    cubeTextureLoader: CubeTextureLoader;
  };

  constructor(sources: Source[]) {
    super();

    // Options
    this.sources = sources;

    // Setup
    this.items = {};
    this.toLoad = this.sources.length;
    this.loaded = 0;

    this.setLoaders();
    this.setLoading();
  }

  setLoaders() {
    this.loaders = {
      gltfLoader: new GLTFLoader(),
      textureLoader: new TextureLoader(),
      cubeTextureLoader: new CubeTextureLoader(),
    };
  }

  setLoading() {
    for (const source of this.sources) {
      if (source.type === "gltfModel") {
        this.loaders.gltfLoader.load(source.path as string, (file) => {
          this.sourceLoaded(source, file);
        });
      } else if (source.type === "texture") {
        this.loaders.textureLoader.load(source.path as string, (file) => {
          this.sourceLoaded(source, file);
        });
      } else if (source.type === "cubeTexture") {
        this.loaders.cubeTextureLoader.load(source.path as string[], (file) => {
          this.sourceLoaded(source, file);
        });
      }
    }
  }

  sourceLoaded(source: Source, file: GLTF | Texture | CubeTexture) {
    this.items[source.name] = file;

    this.loaded++;

    if (this.loaded === this.toLoad) {
      console.log("Resources loaded");
      this.trigger("loaded", {});
    }
  }
}
