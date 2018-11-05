import React, { Component } from "react";
import SimpleSleek from "./components/SimpleSleek";
import FattyGlitch from "./components/FattyGlitch";

require("three/examples/js/loaders/SVGLoader");
require("three/examples/js/controls/OrbitControls");

class App extends Component {
  state = {
    option: "1"
  };

  onWindowResize = () => {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(window.innerWidth, window.innerHeight);
  };

  animate = () => {
    // requestAnimationFrame(this.animate);
    // this.renderer.render(this.scene, this.camera);
  };

  changeOption = e => {
    this.setState({ option: e.nativeEvent.target.value });
  };

  render() {
    const { option } = this.state;
    console.log(option);
    return (
      <React.Fragment>
        {option === "1" ? (
          <SimpleSleek animate={this.animate} />
        ) : option === "2" ? (
          <FattyGlitch animate={this.animate} />
        ) : null}
        <form>
          <fieldset>
            <input
              type="radio"
              name="options"
              value="1"
              onChange={this.changeOption}
              checked={option === "1"}
            />
            <label htmlFor="1">1</label>

            <input
              type="radio"
              name="options"
              value="2"
              onChange={this.changeOption}
              checked={option === "2"}
            />
            <label htmlFor="2">2</label>

            <input
              type="radio"
              name="options"
              value="3"
              onChange={this.changeOption}
              checked={option === "3"}
            />
            <label htmlFor="3">3</label>
          </fieldset>
        </form>
        <canvas ref={el => (this.canvas = el)} onMouseMove={this.mouseMove} />
      </React.Fragment>
    );
  }
}

export default App;
