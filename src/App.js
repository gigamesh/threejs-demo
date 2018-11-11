import React, { Component } from "react";
import SimpleSleek from "./components/SimpleSleek";
import FattyGlitch from "./components/FattyGlitch";
import Experiment1 from "./components/Experiment1";

require("three/examples/js/loaders/SVGLoader");
require("three/examples/js/controls/OrbitControls");

class App extends Component {
  state = {
    option: "3",
    mouse: { x: 200, y: 200 },
    dimensions: { width: 0, height: 0 }
  };

  componentDidMount() {
    window.addEventListener("resize", () => this.getCanvasSize(), false);
    window.addEventListener("mousemove", this.mouseMove, false);
    this.getCanvasSize();
  }

  componentWillUnmount() {
    window.removeEventListener("resize", () => this.getCanvasSize());
    window.removeEventListener("mousemove", () => this.mouseMove);
  }

  getCanvasSize = () => {
    const { width, height } = this.canvasWrap.getBoundingClientRect();
    // console.log("getCanvasSize", width, height);
    this.setState({
      dimensions: {
        width,
        height
      }
    });
  };

  changeOption = e => {
    this.setState({ option: e.nativeEvent.target.value });
  };

  mouseMove = e => {
    this.setState({ mouse: { x: e.clientX, y: e.clientY } });
  };

  render() {
    const { option, mouse, dimensions } = this.state;
    return (
      <React.Fragment>
        <div id="canvas-wrap" ref={el => (this.canvasWrap = el)}>
          {option === "1" ? (
            <SimpleSleek
              mouse={mouse}
              dimensions={dimensions}
              onWindowResize={this.getCanvasSize}
            />
          ) : option === "2" ? (
            <FattyGlitch
              mouse={mouse}
              dimensions={dimensions}
              onWindowResize={this.getCanvasSize}
            />
          ) : option === "3" ? (
            <Experiment1
              mouse={mouse}
              dimensions={dimensions}
              onWindowResize={this.getCanvasSize}
            />
          ) : null}
        </div>
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
