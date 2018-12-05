import React, { Component } from "react";

const fontJSON = require("../helvetiker_bold.typeface.json");
const THREE = require("three");

class PureGold extends Component {
  state = {
    rX: 0,
    rY: 0
  };

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
    if (
      prevProps.mouse.x !== this.props.mouse.x ||
      prevProps.mouse.y !== this.props.mouse.y
    ) {
      this.getRotation();
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

    geometry.translate(-280, 0, 0);

    this.material = new THREE.MeshPhysicalMaterial({
      color: 0xf7da4c,
      metalness: 1,
      roughness: 0.1,
      reflectivity: 1,
      envMap: textureCube,
      envMapIntensity: 1.3
    });
    this.mesh = new THREE.Mesh(geometry, this.material);
    this.mesh.position.set(-25, -20, -350);
    scene.add(this.mesh);

    requestAnimationFrame(this.animate);
  };

  getRotation() {
    const { x, y } = this.props.mouse;
    const xRange = [-0.1, 0.1];
    const yRange = [-0.2, 0.2];

    const rX = convertRange(x, [0, window.innerWidth], xRange);
    const rY = convertRange(y, [0, window.innerHeight], yRange);

    this.setState({
      rX,
      rY
    });

    function convertRange(value, range1, range2) {
      return (
        ((value - range1[0]) * (range2[1] - range2[0])) /
          (range1[1] - range1[0]) +
        range2[0]
      );
    }
  }

  delta = 0;
  animate = () => {
    const { x, y } = this.props.mouse;
    // let wave = Math.sin((this.delta += 0.01));
    // this.mesh.rotation.y += wave * 0.0005;

    this.mesh.rotation.y = this.state.rX;
    this.mesh.rotation.x = this.state.rY;
    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame(this.animate);
  };

  render() {
    return <canvas ref={el => (this.canvas = el)} />;
  }
}

export default PureGold;
