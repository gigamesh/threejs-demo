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

    const overHeadLight = new THREE.HemisphereLight(0xffffff, 0x000000, 1.5);
    scene.add(overHeadLight);
    this.light2 = new THREE.PointLight(0xff0000, 0, 0, 2);
    const light2 = this.light2;
    scene.add(light2);

    const fontLoader = new THREE.FontLoader();
    const font = fontLoader.parse(fontJSON);

    const textureloader = new THREE.CubeTextureLoader();
    const textureCube = textureloader.load([
      "assets/img/pos-x.png",
      "assets/img/neg-x.png",
      "assets/img/pos-y.png",
      "assets/img/neg-y.png",
      "assets/img/pos-z.png",
      "assets/img/neg-z.png"
    ]);

    textureCube.format = THREE.RGBFormat;

    const geometry = new THREE.TextGeometry("HOUSE OF MOVES", {
      font,
      size: 50,
      height: 20,
      bevelThickness: 0,
      material: 20
    });

    geometry.translate(-250, 0, 0);
    // geometry.rotateY(0.2);
    geometry.rotateX(-0.2);
    // geometry.rotateZ(0.5);

    this.material = new THREE.MeshPhysicalMaterial({
      color: 0xdddddd,
      metalness: 0.6,
      roughness: 0.2,
      reflectivity: 0.8,
      envMap: textureCube,
      envMapIntensity: 1.3
    });
    this.mesh = new THREE.Mesh(geometry, this.material);
    this.mesh.position.set(0, 0, -700);

    scene.add(this.mesh);

    requestAnimationFrame(this.animate);
  }
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
      // <img src="assets/img/LA-xlarge.jpg" />
    );
  }
}

export default App;
