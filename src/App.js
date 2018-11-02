import React, { Component } from "react";
import "./App.css";

const fontJSON = require("./helvetiker_bold.typeface.json");
const THREE = require("three");

class App extends Component {
  state = {
    mouseX: 0,
    mouseY: 0
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

    const light1 = new THREE.AmbientLight(0x85c210, 0.9);
    scene.add(light1);
    this.light2 = new THREE.PointLight(0xffffff, 0.6);
    const light2 = this.light2;
    scene.add(light2);

    const loader = new THREE.FontLoader();
    const font = loader.parse(fontJSON);

    const geometry = new THREE.TextGeometry("HOUSE OF MOVES", {
      font,
      size: 40,
      height: 20,
      bevelThickness: 1,
      material: 10
    });

    // const geometry = new THREE.TorusKnotGeometry(80, 25, 150, 150);
    geometry.translate(-250, 0, 0);
    // geometry.rotateY(0.5);
    // geometry.rotateZ(0.5);
    const material = new THREE.MeshPhongMaterial({
      color: 0xdbefb3
      // emissive: 0x00ff00
    });
    this.mesh = new THREE.Mesh(geometry, material);
    const mesh = this.mesh;
    mesh.position.set(0, 0, -500);

    scene.add(mesh);

    requestAnimationFrame(this.animate);
  }

  delta = 0;
  animate = () => {
    let wave = Math.sin((this.delta += 0.01));
    this.mesh.rotation.y += wave * 0.001;
    this.light2.position.set(this.state.mouseX - 500, this.state.mouseY, -100);
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
