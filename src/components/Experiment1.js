import React, { Component } from "react";

var THREE = (window.THREE = require("three"));
require("three/examples/js/loaders/SVGLoader");
require("three/examples/js/controls/OrbitControls");

require("three/examples/js/shaders/CopyShader");
require("three/examples/js/shaders/AfterimageShader");
require("three/examples/js/shaders/FXAAShader");
require("three/examples/js/postprocessing/EffectComposer");
require("three/examples/js/postprocessing/RenderPass");
require("three/examples/js/postprocessing/MaskPass");
require("three/examples/js/postprocessing/ShaderPass");
require("three/examples/js/postprocessing/AfterimagePass");

class SimpleSleek extends Component {
  constructor() {
    super();
    this.group = new THREE.Group();
    this.pivot = new THREE.Object3D();
    this.state = {
      logoPos: { x: 0, y: 0 }
    };
  }

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
    if (prevProps.mouse.x !== this.props.mouse.x) {
      this.getLogoPosition();
    }
  }

  repaint = () => {
    const { width, height } = this.props.dimensions;
    let dpr = 1;
    if (window.devicePixelRatio !== undefined) {
      dpr = window.devicePixelRatio;
    }

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: true
    });
    this.renderer.setPixelRatio(dpr);
    this.renderer.setSize(width, height);
    // this.renderer.setClearColor(0xffffff);

    ////////////// CAMERA
    this.camera = new THREE.PerspectiveCamera(50, width / height, 1, 1000);
    this.camera.position.set(0, 0, 200);

    ///////////// SCENE
    this.scene = new THREE.Scene();
    const { scene } = this;
    // scene.background = new THREE.Color(0xffffff);
    // scene.fog = new THREE.Fog(0x000000, 1, 1000);

    var helper = new THREE.GridHelper(160, 10, 0xcccccc, 0xcccccc);
    helper.rotation.x = Math.PI / 2;

    // this.scene.add(helper);

    /////////// LIGHTS
    const light1 = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(light1);
    this.light2 = new THREE.PointLight(0xffffff, 0.6, 0, 2);
    const { light2 } = this;
    light2.position.set(0, 100, 100);
    scene.add(light2);
    const light3 = new THREE.HemisphereLight(0xffffff, 0x000000, 1.8);
    scene.add(light3);

    // var lightHelper = new THREE.PointLightHelper(light2, 20, 0x444444);
    // scene.add(lightHelper);

    //////////// LOADER
    var loader = new THREE.SVGLoader();
    loader.load("assets/svg/Hom_logo3a.svg", paths => {
      this.pivot.position.x = -80;
      this.pivot.position.y = 0;
      this.pivot.scale.y *= -1;

      for (var i = 0; i < paths.length; i++) {
        var path = paths[i];

        var textMaterial = new THREE.MeshStandardMaterial({
          color: 0x7abf50,
          roughness: 0.2,
          metalness: 0.53
        });

        var shapes = path.toShapes(true);

        for (var j = 0; j < shapes.length; j++) {
          var shape = shapes[j];
          var extrudeSettings = {
            steps: 2,
            depth: 15,
            bevelEnabled: true,
            bevelThickness: 1,
            bevelSize: 1,
            bevelSegments: 1,
            curveSegments: 40
          };
          var geometry = new THREE.ExtrudeBufferGeometry(
            shape,
            extrudeSettings
          );
          const mesh = new THREE.Mesh(geometry, textMaterial);
          mesh.position.x = -350;
          mesh.position.y = -100;
          this.group.add(mesh);
          this.pivot.add(mesh);
        }
      }
      scene.add(this.pivot);
      scene.add(this.group);
    });

    ///////////////  POST-PROCESSING
    this.composer = new THREE.EffectComposer(this.renderer);

    const afterimagePass = new THREE.AfterimagePass();
    afterimagePass.renderToScreen = true;

    const effectFXAA = new THREE.ShaderPass(THREE.FXAAShader);
    effectFXAA.uniforms["resolution"].value.set(
      1 / (width * dpr),
      1 / (height * dpr)
    );
    effectFXAA.renderToScreen = true;
    this.composer.setSize(width * dpr, height * dpr);

    this.composer.addPass(afterimagePass);
    this.composer.addPass(new THREE.RenderPass(scene, this.camera));
    // this.composer.addPass(effectFXAA);

    ////////////// CONTROLS
    // var controls = new THREE.OrbitControls(
    //   this.camera,
    //   this.renderer.domElement
    // );
    // controls.screenSpacePanning = true;

    this.animate();
  };

  getLogoPosition() {
    const { x: mouseX, y: mouseY } = this.props.mouse;
    const midPoint = window.innerWidth / 2;
    const xRange = [-0.05, 0.05];
    const yRange = [-0.3, 0.3];
    const x = convertRange(mouseX, [0, window.innerWidth], xRange);
    const y = convertRange(mouseY, [0, window.innerHeight], yRange);

    this.setState({
      logoPos: { x, y }
    });

    function convertRange(value, range1, range2) {
      return (
        ((value - range1[0]) * (range2[1] - range2[0])) /
          (range1[1] - range1[0]) +
        range2[0]
      );
    }
  }

  zoom = 0;
  animate = () => {
    requestAnimationFrame(this.animate);

    this.pivot.rotation.y = this.state.logoPos.x;
    this.pivot.rotation.x = this.state.logoPos.y;
    if (this.zoom < 0.45) {
      this.zoom += 0.01;
      this.pivot.scale.x = this.zoom;
      this.pivot.scale.y = -this.zoom;
      this.pivot.scale.z = this.zoom;
    }

    this.composer.render();
  };

  render() {
    // console.log(this.state.logoPos);
    return <canvas ref={el => (this.canvas = el)} />;
  }
}

export default SimpleSleek;
