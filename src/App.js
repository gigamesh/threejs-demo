import React, { Component } from "react";
import "./App.css";

const fontJSON = require("./helvetiker_bold.typeface.json");
const THREE = require("three");

class App extends Component {
  state = {
    mouseX: 0,
    mouseY: 0,
    wireframe: false
  };

  componentDidMount() {
    ////////////////// RENDERER
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true
    });

    const renderer = this.renderer;
    renderer.setClearColor(0xffffff);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);

    ////////////////// CAMERA
    this.camera = new THREE.PerspectiveCamera(
      35,
      window.innerWidth / window.innerHeight,
      0.1,
      3000
    );

    ////////////////// SCENE
    this.scene = new THREE.Scene();
    const scene = this.scene;

    const light1 = new THREE.AmbientLight(0x85c210, 1.5);
    scene.add(light1);
    this.light2 = new THREE.PointLight(0xffffff, 0.4, 0, 2);
    const light2 = this.light2;
    scene.add(light2);
    const light3 = new THREE.HemisphereLight(0xffffff, 0x000000, 2);
    scene.add(light3);

    ////////////////// LOADER
    const loader = new THREE.SVGLoader();
    loader.load(
      "assets/svg/Hom_logo3a.svg",
      createGeometry,
      xhr => {
        console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
      },
      error => {
        console.log("An error happened");
      }
    );

    ///////////////// GEOMETRY

    const createGeometry = paths => {
      const group = new THREE.Group();

      for (let i = 0; i < paths.length; i++) {
        const path = paths[i];

        const material = new THREE.MeshStandardMaterial({
          color: 0xffffff,
          side: THREE.DoubleSide,
          depthWrite: false,
          metalness: 0.5,
          roughness: 0.5
        });

        const shapes = path.toShapes(true);

        for (let j = 0; j < shapes.length; j++) {
          const shape = shapes[j];
          const geometry = new THREE.ShapeBufferGeometry(shape);
          const mesh = new THREE.Mesh(geometry, material);
          group.add(mesh);
        }
      }

      scene.add(group);
    };
    // const geometry = new THREE.TextGeometry("HOUSE OF MOVES", {
    //   font,
    //   size: 40,
    //   height: 20,
    //   bevelThickness: 20,
    //   material: 10
    // });

    // geometry.translate(-250, 0, 0);
    // geometry.rotateX(-0.2);
    // this.material = new THREE.MeshStandardMaterial({
    //   color: 0x6ebf42,
    //   // emissive: 0x0b3307,
    //   // emissiveIntensity: 0.1,
    //   metalness: 0.5,
    //   roughness: 0.5,
    //   wireframe: false
    // });

    ///////////////// MESH
    // this.mesh = new THREE.Mesh(geometry, this.material);
    // const mesh = this.mesh;
    // mesh.position.set(0, 0, -500);

    // scene.add(mesh);

    requestAnimationFrame(this.animate);

    // this.glitchTimer = setInterval(this.glitch, 4000);
  }

  animate = () => {
    this.light2.position.set(
      this.state.mouseX - 800,
      this.state.mouseY - 300,
      -100
    );
    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame(this.animate);
  };

  mouseMove = e => {
    this.setState({
      mouseX: e.nativeEvent.offsetX,
      mouseY: e.nativeEvent.offsetY
    });
  };

  render() {
    // console.log(this.state.mouseX, this.state.mouseY);
    return (
      <canvas ref={el => (this.canvas = el)} onMouseMove={this.mouseMove} />
    );
  }
}

export default App;
