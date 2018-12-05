import React, { Component } from "react";

const fontJSON = require("../helvetiker_bold.typeface.json");
const THREE = require("three");

class PureGold extends Component {
  componentDidMount() {
    this.repaint();
  }
  componentDidUpdate(prevProps) {
    if (
      prevProps.dimensions.width !== this.props.dimensions.width ||
      prevProps.dimensions.height !== this.props.dimensions.height
    ) {
      this.repaint();
    }
  }
  repaint = () => {
    const { width, height } = this.props.dimensions;

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: true
    });
    const renderer = this.renderer;
    renderer.setClearColor(0x000000, 0);
    // renderer.setClearColor(0xedbe15);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(width, height);

    this.camera = new THREE.PerspectiveCamera(35, width / height, 0.1, 3000);
    this.scene = new THREE.Scene();
    const scene = this.scene;

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

    const geometry = new THREE.TextGeometry("PURE GOLD BABY!", {
      font,
      size: 50,
      height: 10,
      curveSegments: 10,
      bevelEnabled: true,
      bevelThickness: 2,
      bevelSize: 2,
      bevelSegments: 1
    });

    geometry.translate(-200, 0, 0);
    // geometry.rotateX(-0.2);

    this.material = new THREE.MeshPhysicalMaterial({
      color: 0xf7da4c,
      metalness: 1,
      roughness: 0.1,
      reflectivity: 1,
      envMap: textureCube,
      envMapIntensity: 1.3
    });
    this.mesh = new THREE.Mesh(geometry, this.material);
    this.mesh.position.set(-100, -20, -350);

    scene.add(this.mesh);

    requestAnimationFrame(this.animate);
  };
  delta = 0;
  animate = () => {
    let wave = Math.sin((this.delta += 0.01));
    this.mesh.rotation.y += wave * 0.0005;
    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame(this.animate);
  };

  render() {
    return <canvas ref={el => (this.canvas = el)} />;
  }
}

export default PureGold;
