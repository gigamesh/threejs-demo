import React, { Component } from "react";
const THREE = require("three");
const fontJSON = require("../helvetiker_bold.typeface.json");

export default class FattyGlitch extends Component {
  state = {
    wireframe: false
  };

  componentDidMount() {
    this.repaint();
    requestAnimationFrame(this.animate);
    this.glitchTimer = setInterval(this.glitch, 4000);
  }

  componentDidUpdate(prevProps) {
    const { wrapHeight, wrapWidth } = this.props.dimensions;
    if (
      prevProps.dimensions.wrapWidth !== wrapWidth ||
      prevProps.dimensions.wrapHeight !== wrapHeight
    ) {
      this.repaint();
    }
  }

  repaint() {
    const { wrapWidth, wrapHeight } = this.props.dimensions;
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: true
    });
    const renderer = this.renderer;
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(wrapWidth, wrapHeight);

    this.camera = new THREE.PerspectiveCamera(
      35,
      wrapWidth / wrapHeight,
      0.1,
      3000
    );
    this.scene = new THREE.Scene();
    const scene = this.scene;

    const light1 = new THREE.AmbientLight(0xc11111, 0.6);
    scene.add(light1);
    this.light2 = new THREE.PointLight(0xf4c60c, 1.5);
    const light2 = this.light2;
    scene.add(light2);
    const light3 = new THREE.HemisphereLight(0x7ff2ff, 0xb20101, 1.7);
    // light3.position.set(50, 100, 1000);
    scene.add(light3);

    const loader = new THREE.FontLoader();
    const font = loader.parse(fontJSON);

    const geometry = new THREE.TextGeometry("NIGHT LIGHT", {
      font,
      size: 60,
      height: 20,
      bevelThickness: 20,
      material: 10
    });

    geometry.translate(-245, 0, 0);
    geometry.rotateX(-0.2);
    this.material = new THREE.MeshPhysicalMaterial({
      color: 0x43f9f9,
      metalness: 0.4,
      roughness: 0.4,
      clearCoat: 0.5,
      reflectivity: 0.5,
      clearCoatRoughness: 0.5,
      wireframe: false
    });
    this.mesh = new THREE.Mesh(geometry, this.material);
    const mesh = this.mesh;
    mesh.position.set(0, -30, -300);

    scene.add(mesh);
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
    // console.log(this.mesh.rotation.y);
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
      // </div>
    );
  }
}
