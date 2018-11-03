import React, { Component } from "react";
import "./App.css";

var THREE = (window.THREE = require("three"));
require("three/examples/js/loaders/SVGLoader");

class App extends Component {
  state = {
    mouseX: 0,
    mouseY: 0,
    wireframe: false,
    changeMe: 0
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
    this.camera.position.set(0, 0, 200);

    ////////////////// SCENE
    this.scene = new THREE.Scene();
    const scene = this.scene;

    const helper = new THREE.GridHelper(160, 10);
    helper.rotation.x = Math.PI / 2;
    scene.add(helper);

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
      "assets/svg/tiger.svg",
      paths => {
        const group = new THREE.Group();
        group.scale.multiplyScalar(0.25);
        group.position.x = -70;
        group.position.y = -70;
        group.scale.y *= -1;

        for (let i = 0; i < paths.length; i++) {
          const path = paths[i];

          const material = new THREE.MeshStandardMaterial({
            color: path.color,
            // color: 0xffffff,
            side: THREE.DoubleSide,
            depthWrite: false
            // metalness: 0.5,
            // roughness: 0.5
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
      },
      xhr => {
        console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
      },
      error => {
        console.log("An error happened");
      }
    );
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
