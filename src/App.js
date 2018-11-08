import React, { Component } from "react";
import SimpleSleek from "./components/SimpleSleek";
import FattyGlitch from "./components/FattyGlitch";
import Experiment1 from "./components/Experiment1";

require("three/examples/js/loaders/SVGLoader");
require("three/examples/js/controls/OrbitControls");

class App extends Component {
  state = {
    option: "1",
    mouse: { x: 0, y: 0 },
    canvas: { width: 0, height: 0 }
  };

  onWindowResize = el => {
    const { width, height } = el.getBoundingClientRect();
    this.setState({
      canvas: {
        width,
        height
      }
    });
  };

  changeOption = e => {
    this.setState({ option: e.nativeEvent.target.value });
  };

  mouseMove = e => {
    // x: 680, y: 695 ===> x: 1182, y: 695

    function convertRange(value, range1, range2) {
      return (
        ((value - range1[0]) * (range2[1] - range2[0])) /
          (range1[1] - range1[0]) +
        range2[0]
      );
    }
    this.setState({
      mouse: { x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY }
    });
  };

  render() {
    const { option, mouse, canvas } = this.state;
    // console.log(option);
    return (
      <React.Fragment>
        {option === "1" ? (
          <SimpleSleek
            mouseMove={this.mouseMove}
            mouse={mouse}
            canvas={canvas}
            onWindowResize={this.onWindowResize}
          />
        ) : option === "2" ? (
          <FattyGlitch
            mouseMove={this.mouseMove}
            mouse={mouse}
            canvas={canvas}
            onWindowResize={this.onWindowResize}
          />
        ) : option === "3" ? (
          <Experiment1
            mouseMove={this.mouseMove}
            mouse={mouse}
            canvas={canvas}
            onWindowResize={this.onWindowResize}
          />
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
      </React.Fragment>
    );
  }
}

export default App;
