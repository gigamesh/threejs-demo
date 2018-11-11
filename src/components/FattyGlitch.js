import React, { Component } from "react";
const THREE = require("three");
const fontJSON = require("../helvetiker_bold.typeface.json");

export default class FattyGlitch extends Component {
  state = {
    wireframe: false
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
  }

  repaint() {
    const { width, height } = this.props.dimensions;
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true
    });
    const renderer = this.renderer;
    renderer.setClearColor(0xffffff);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(width, height);

    this.camera = new THREE.PerspectiveCamera(35, width / height, 0.1, 3000);
    this.scene = new THREE.Scene();
    const scene = this.scene;

    const light1 = new THREE.AmbientLight(0x85c210, 1);
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
      size: 60,
      height: 20,
      bevelThickness: 20,
      material: 10
    });

    geometry.translate(-360, 0, 0);
    geometry.rotateX(-0.2);
    this.material = new THREE.MeshStandardMaterial({
      color: 0x6ebf42,
      metalness: 0.5,
      roughness: 0.5,
      wireframe: false
    });
    this.mesh = new THREE.Mesh(geometry, this.material);
    const mesh = this.mesh;
    mesh.position.set(0, 0, -500);

    scene.add(mesh);

    requestAnimationFrame(this.animate);

    this.glitchTimer = setInterval(this.glitch, 4000);
  }

  glitch = () => {
    this.material.wireframe = true;
    setTimeout(() => {
      this.material.wireframe = false;
      setTimeout(() => {
        this.material.wireframe = true;
        setTimeout(() => {
          this.material.wireframe = false;
        }, 70);
      }, 60);
    }, 80);
  };

  delta = 0;
  animate = () => {
    let wave = Math.sin((this.delta += 0.02));
    this.mesh.rotation.y += wave * 0.0005;
    this.light2.position.set(
      this.props.mouse.x - 800,
      this.props.mouse.y - 300,
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
    return (
      <canvas
        ref={el => (this.canvas = el)}
        onMouseMove={this.props.mouseMove}
      />
    );
  }
}
