import React, { Component } from "react";
import SimpleSleek from "./components/Daylight";
import FattyGlitch from "./components/NightLight";
import PureGold from "./components/PureGold";

require("three/examples/js/loaders/SVGLoader");
require("three/examples/js/controls/OrbitControls");

class App extends Component {
  state = {
    option: "1",
    mouse: { x: 200, y: 200 },
    dimensions: { width: 0, height: 0 },
    orient: {},
    tick: 0,
    mobile: false
  };

  componentDidMount() {
    window.addEventListener("resize", () => this.getCanvasSize(), false);
    window.addEventListener("mousemove", this.mouseMove, false);
    if (
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      )
    ) {
      this.setState({ mobile: true });
    }
    if (window.DeviceOrientationEvent) {
      window.addEventListener(
        "deviceorientation",
        this.orientationHandler,
        false
      );
    }
    this.getCanvasSize();
    this.nextFrame();
  }

  orientationHandler = e => {
    if (this.state.tick === 0) {
      this.setState({
        orient: {
          alpha: e.alpha,
          beta: e.beta,
          gamma: e.gamma
        },
        tick: 0
      });
    }
    requestAnimationFrame(this.nextFrame);
  };

  nextFrame = () => {
    this.setState(prevState => ({
      tick: prevState.tick === 2 ? 0 : ++prevState.tick
    }));
    requestAnimationFrame(this.nextFrame);
  };

  componentWillUnmount() {
    window.removeEventListener("resize", () => this.getCanvasSize());
    window.removeEventListener("mousemove", () => this.mouseMove);
  }

  getCanvasSize = () => {
    const { width, height } = this.wrap.getBoundingClientRect();
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
    if (this.state.tick === 0) {
      this.setState({ mouse: { x: e.clientX, y: e.clientY } });
    }
  };

  render() {
    const { option, mouse, dimensions, orient, mobile } = this.state;

    const color = option === "1" ? blackBG : option === "2" ? whiteBG : goldBG;
    return (
      <div style={{ ...backgroundWrap, ...color }}>
        <React.Fragment>
          <div id="canvas-wrap" ref={el => (this.wrap = el)}>
            {option === "2" ? (
              <SimpleSleek
                mouse={mouse}
                dimensions={dimensions}
                orient={orient}
                mobile={mobile}
              />
            ) : option === "1" ? (
              <FattyGlitch
                mouse={mouse}
                dimensions={dimensions}
                orient={orient}
                mobile={mobile}
              />
            ) : option === "3" ? (
              <PureGold
                mouse={mouse}
                dimensions={dimensions}
                orient={orient}
                mobile={mobile}
              />
            ) : null}
          </div>
          <form>
            <fieldset>
              <h3>Three.js Demo</h3>
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
      </div>
    );
  }
}

const backgroundWrap = {
  width: "100%",
  height: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  flexDirection: "column"
};

const blackBG = {
  background: "radial-gradient(transparent, black 90%), #0b4b4f"
};

const whiteBG = {
  background: "#fff"
};

const goldBG = {
  // background: "#fcdd2f",
  background: "url('assets/img/sunset.jpg')",
  backgroundRepeat: "no-repeat",
  backgroundSize: "cover",
  boxShadow: "inset 0 0 20vmax black"
};

export default App;
