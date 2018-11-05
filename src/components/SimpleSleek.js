import React, { Component } from "react";

var THREE = (window.THREE = require("three"));
require("three/examples/js/loaders/SVGLoader");
require("three/examples/js/controls/OrbitControls");

class SimpleSleek extends Component {
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
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFShadowMap;

    // window.addEventListener("resize", this.onWindowResize, false);

    ////////////// CAMERA
    this.camera = new THREE.PerspectiveCamera(
      50,
      window.innerWidth / window.innerHeight,
      1,
      1000
    );
    this.camera.position.set(0, 0, 200);

    ///////////// SCENE
    this.scene = new THREE.Scene();
    const { scene } = this;
    this.scene.background = new THREE.Color(0xf4f4e6);

    var helper = new THREE.GridHelper(160, 10, 0xcccccc, 0xcccccc);
    helper.rotation.x = Math.PI / 2;

    // this.scene.add(helper);

    /////////// LIGHTS
    const light1 = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(light1);
    this.light2 = new THREE.PointLight(0xffffff, 0.6, 0, 2);
    const { light2 } = this;
    light2.position.set(0, 100, 100);
    light2.castShadow = true;
    light2.shadow.mapSize.height = 2048;
    light2.shadow.mapSize.width = 2048;
    light2.shadow.radius = 4;
    light2.shadow.camera.far = 1500;
    scene.add(light2);
    const light3 = new THREE.HemisphereLight(0xffffff, 0x000000, 2);
    scene.add(light3);

    // var lightHelper = new THREE.PointLightHelper(light2, 20, 0x444444);
    // scene.add(lightHelper);

    //////////// LOADER
    var loader = new THREE.SVGLoader();
    loader.load("assets/svg/Hom_logo3a.svg", function(paths) {
      var group = new THREE.Group();
      group.scale.multiplyScalar(0.25);
      group.position.x = -132;
      group.position.y = 40;
      group.scale.y *= -1;

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
            depth: 20,
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
          var mesh = new THREE.Mesh(geometry, textMaterial);
          mesh.castShadow = true;
          mesh.receiveShadow = true;

          group.add(mesh);
        }
      }

      const planeGeo = new THREE.PlaneGeometry(4000, 4000, 100, 100);
      const planeMaterial = new THREE.MeshStandardMaterial({
        color: 0xf4f4e6
      });
      const planeMesh = new THREE.Mesh(planeGeo, planeMaterial);
      planeMesh.receiveShadow = true;
      scene.add(planeMesh);
      scene.add(group);
    });

    ////////////// CONTROLS
    var controls = new THREE.OrbitControls(
      this.camera,
      this.renderer.domElement
    );
    controls.screenSpacePanning = true;

    this.animate();
  }

  componentWillUnmount() {
    // window.removeEventListener("resize", this.onWindowResize);
  }

  onWindowResize = () => {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(window.innerWidth, window.innerHeight);
  };

  animate = () => {
    requestAnimationFrame(this.animate);
    this.light2.position.set(
      this.state.mouseX - 900,
      -this.state.mouseY + 800,
      200
    );
    this.renderer.render(this.scene, this.camera);
  };

  mouseMove = e => {
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

export default SimpleSleek;
