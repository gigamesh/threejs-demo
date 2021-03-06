import React, { Component } from "react";

const fontJSON = require("../helvetiker_bold.typeface.json.js");
const THREE = require("three");

class PureGold extends Component {
  state = {
    rX: 0,
    rY: 0,
    testX: 0,
    opacity: 0
  };

  componentDidMount() {
    this.repaint();
  }

  componentDidUpdate(prevProps) {
    const { wrapHeight, wrapWidth } = this.props.dimensions;
    if (
      prevProps.dimensions.wrapWidth !== wrapWidth ||
      prevProps.dimensions.wrapHeight !== wrapHeight
    ) {
      this.repaint();
    }
    if (
      this.props.mobile ||
      (prevProps.mouse.x !== this.props.mouse.x ||
        prevProps.mouse.y !== this.props.mouse.y)
    ) {
      this.getRotation();
    }
  }

  repaint = () => {
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
    this.cameraCube = new THREE.PerspectiveCamera(
      35,
      wrapWidth / wrapHeight,
      0.1,
      3000
    );
    this.scene = new THREE.Scene();
    const scene = this.scene;

    const fontLoader = new THREE.FontLoader();
    const font = fontLoader.parse(fontJSON);

    const textureloader = new THREE.CubeTextureLoader();
    this.textureCube = textureloader.load(
      [
        "assets/img/skyboxsun5deg2/pos-x.jpg",
        "assets/img/skyboxsun5deg2/neg-x.jpg",
        "assets/img/skyboxsun5deg2/pos-y.jpg",
        "assets/img/skyboxsun5deg2/neg-y.jpg",
        "assets/img/skyboxsun5deg2/pos-z.jpg",
        "assets/img/skyboxsun5deg2/neg-z.jpg"
      ],
      () => {
        this.setState({ opacity: 1 });
      }
    );

    const geometry = new THREE.TextGeometry("Left Field Labs", {
      font,
      size: 28,
      height: 10,
      curveSegments: 20,
      bevelEnabled: true,
      bevelThickness: .5,
      bevelSize: .5,
      bevelSegments: 1
    });

    geometry.translate(-115, 20, 0);

    this.material = new THREE.MeshStandardMaterial({
      color: 0xf7da4c,
      metalness: 1,
      roughness: 0,
      reflectivity: 1,
      envMap: this.textureCube,
      envMapIntensity: 1.5
    });
    this.mesh = new THREE.Mesh(geometry, this.material);
    this.mesh.position.set(-20, -20, -350);

    scene.add(this.mesh);

    requestAnimationFrame(this.animate);
  };

  getRotation() {
    let x, y, xInput, yInput;
    let xOutput = [-0.1, 0.2];
    let yOutput = [-0.15, 0.05];

    if (this.props.mobile) {
      x = this.props.orient.gamma;
      y = this.props.orient.beta;
      xInput = [100, 0];
      yInput = [-90, 90];
    } else {
      x = this.props.mouse.x;
      y = this.props.mouse.y;
      xInput = [0, window.innerWidth];
      yInput = [0, window.innerHeight];
    }

    const rX = convertRange(x, xInput, xOutput);
    const rY = convertRange(y, yInput, yOutput);

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

  canvasLoaded = () => {
    this.setState({ opacity: 1 });
  };

  animate = () => {
    setTimeout(() => {
      this.mesh.rotation.y = this.state.rX;
      this.mesh.rotation.x = this.state.rY;
      this.renderer.render(this.scene, this.camera);
      requestAnimationFrame(this.animate);
    }, 1000 / this.props.fps);
  };

  render() {
    const { mobile, orient } = this.props;

    return (
      <React.Fragment>
        <canvas
          ref={el => (this.canvas = el)}
          style={{ opacity: this.state.opacity, transition: "2s opacity" }}
        />
        {mobile && (
          <div>
            <h5>beta: {orient.beta}</h5>
            <h5>gamma: {orient.gamma}</h5>
          </div>
        )}
      </React.Fragment>
    );
  }
}

export default PureGold;
