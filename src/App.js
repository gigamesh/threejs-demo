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
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true
    });
    const renderer = this.renderer;
    renderer.setClearColor(0xffffff);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);

    this.camera = new THREE.PerspectiveCamera(
      35,
      window.innerWidth / window.innerHeight,
      0.1,
      3000
    );
    this.scene = new THREE.Scene();
    const scene = this.scene;

    const light1 = new THREE.AmbientLight(0x85c210, 1.5);
    scene.add(light1);
    this.light2 = new THREE.PointLight(0x22ffffff, 0.5, 0, 2);
    const light2 = this.light2;
    scene.add(light2);
    const light3 = new THREE.HemisphereLight(0xffffff, 0x000000, 2);
    // light3.position.set(50, 100, 1000);
    scene.add(light3);

    const loader = new THREE.FontLoader();
    const font = loader.parse(fontJSON);

    const geometry = new THREE.TextGeometry("HOUSE OF MOVES", {
      font,
      size: 40,
      height: 20,
      bevelThickness: 20,
      material: 10
    });

    geometry.translate(-250, 0, 0);
    // geometry.rotateY(0.25);
    geometry.rotateX(-0.2);
    // geometry.rotateZ(0.5);
    this.material = new THREE.MeshStandardMaterial({
      color: 0x6ebf42,
      // emissive: 0x0b3307,
      // emissiveIntensity: 0.1,
      metalness: 0.5,
      roughness: 0.5,
      wireframe: false
    });
    this.mesh = new THREE.Mesh(geometry, this.material);
    const mesh = this.mesh;
    mesh.position.set(0, 0, -500);

    scene.add(mesh);

    requestAnimationFrame(this.animate);

    this.glitchTimer = setInterval(this.glitch, 5000);
  }

  glitch = () => {
    this.material.wireframe = true;
    setTimeout(() => {
      this.material.wireframe = false;
      setTimeout(() => {
        this.material.wireframe = true;
        setTimeout(() => {
          this.material.wireframe = false;
        }, 50);
      }, 50);
    }, 50);
  };

  delta = 0;
  animate = () => {
    let wave = Math.sin((this.delta += 0.01));
    this.mesh.rotation.y += wave * 0.001;
    this.light2.position.set(
      this.state.mouseX - 800,
      this.state.mouseY - 300,
      -100
    );
    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame(this.animate);
  };

  mouseMove = e => {
    // console.log(e.nativeEvent.offsetX);
    this.setState({
      mouseX: e.nativeEvent.offsetX,
      mouseY: e.nativeEvent.offsetY
    });
  };

  render() {
    return (
      <canvas ref={el => (this.canvas = el)} onMouseMove={this.mouseMove} />
    );
  }
}

export default App;
