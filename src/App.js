import React, { Component } from "react";
import "./App.css";

var THREE = (window.THREE = require("three"));
require("three/examples/js/loaders/SVGLoader");

class App extends Component {
  constructor() {
    this.scene = new THREE.Scene();
  }

  componentDidMount() {
    this.init();
    this.animate();
  }
  //

  init = () => {
    //

    this.scene.background = new THREE.Color(0xb0b0b0);

    //

    this.camera = new THREE.PerspectiveCamera(
      50,
      window.innerWidth / window.innerHeight,
      1,
      1000
    );
    this.camera.position.set(0, 0, 200);

    //

    var helper = new THREE.GridHelper(160, 10);
    helper.rotation.x = Math.PI / 2;
    this.scene.add(helper);

    //

    var loader = new THREE.SVGLoader();
    loader.load("assets/svg/Hom_logo3a.svg", function(paths) {
      var group = new THREE.Group();
      group.scale.multiplyScalar(0.25);
      group.position.x = -70;
      group.position.y = 70;
      group.scale.y *= -1;

      for (var i = 0; i < paths.length; i++) {
        var path = paths[i];

        var material = new THREE.MeshBasicMaterial({
          color: path.color,
          side: THREE.DoubleSide,
          depthWrite: false
        });

        var shapes = path.toShapes(true);

        for (var j = 0; j < shapes.length; j++) {
          var shape = shapes[j];

          var geometry = new THREE.ShapeBufferGeometry(shape);
          var mesh = new THREE.Mesh(geometry, material);

          group.add(mesh);
        }
      }

      this.scene.add(group);
    });

    //

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    window.addEventListener("resize", this.onWindowResize, false);

    document.body.addEventListener("dblclick", function(event) {
      var group = this.scene.children[1];
      group.traverse(function(child) {
        if (child.material)
          child.material.wireframe = !child.material.wireframe;
      });
    });
  };

  onWindowResize = () => {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(window.innerWidth, window.innerHeight);
  };

  animate = () => {
    requestAnimationFrame(this.animate);

    this.run();
  };

  run = () => {
    this.renderer.render(this.scene, this.camera);
  };

  render() {
    // console.log(this.state.mouseX, this.state.mouseY);
    return (
      <canvas ref={el => (this.canvas = el)} onMouseMove={this.mouseMove} />
    );
  }
}

export default App;
