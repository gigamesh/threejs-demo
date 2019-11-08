import React, { Component } from "react";
import DayLight from "./components/DayLight";
import NightLight from "./components/NightLight";
import PureGold from "./components/PureGold";

require("three/examples/js/loaders/SVGLoader");
require("three/examples/js/controls/OrbitControls");

class App extends Component {
  fps = 30;
  state = {
    option: "1",
    mouse: { x: 200, y: 200 },
    orient: {},
    mobile: false,
    wrapWidth: 0,
    wrapHeight: 0
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
  }

  orientationHandler = e => {
    this.setState({
      orient: {
        alpha: e.alpha,
        beta: e.beta,
        gamma: e.gamma
      }
    });
  };

  componentWillUnmount() {
    window.removeEventListener("resize", () => this.getCanvasSize());
    window.removeEventListener("mousemove", () => this.mouseMove);
  }

  getCanvasSize = () => {
    const { width, height } = this.wrap.getBoundingClientRect();

    // timer to defer setting new dimensions until resizing has stopped
    setTimeout(() => {
      this.setState({
        wrapHeight: height,
        wrapWidth: width
      });
    }, 0);
  };

  changeOption = e => {
    this.setState({ option: e.nativeEvent.target.value });
  };

  mouseMove = e => {
    this.setState({ mouse: { x: e.clientX, y: e.clientY } });
  };

  render() {
    const { option, mouse, orient, mobile, wrapHeight, wrapWidth } = this.state;

    const color = option === "3" ? goldBG : whiteBG;

    return (
      <div style={{ ...backgroundWrap, ...color }}>
        <div id="canvas-wrap" ref={el => (this.wrap = el)}>
          {wrapHeight && wrapWidth && (
            <React.Fragment>
              {option === "1" ? (
                <DayLight
                  mouse={mouse}
                  dimensions={{ wrapWidth, wrapHeight }}
                  orient={orient}
                  mobile={mobile}
                  fps={this.fps}
                />
              ) : option === "2" ? (
                <NightLight
                  mouse={mouse}
                  dimensions={{ wrapWidth, wrapHeight }}
                  orient={orient}
                  mobile={mobile}
                  fps={this.fps}
                />
              ) : option === "3" ? (
                <PureGold
                  mouse={mouse}
                  dimensions={{ wrapWidth, wrapHeight }}
                  orient={orient}
                  mobile={mobile}
                  fps={this.fps}
                />
              ) : null}
            </React.Fragment>
          )}
        </div>
        <form>
          <fieldset>
            <h3>Three.js Demo</h3>
            {["1", "2", "3"].map(current => (
              <React.Fragment>
                <input
                  type="radio"
                  name="options"
                  value={current}
                  onChange={this.changeOption}
                  checked={this.state.option === current}
                />
                <label htmlFor={current}>{current}</label>
              </React.Fragment>
            ))}
          </fieldset>
        </form>
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
  background:
    "url(http://pluspng.com/img-png/stars-png-stars-png-image-png-image-1550.png), radial-gradient(transparent, black 90%), #032426"
};

const whiteBG = {
  background: "#fff"
};

const goldBG = {
  background: "url(assets/img/sunset.jpg)",
  backgroundRepeat: "no-repeat",
  backgroundSize: "cover",
  boxShadow: "inset 0 0 20vmax black"
};

export default App;
