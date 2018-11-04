import React, { Component } from "react";

class App extends Component {
  render() {
    return (
      <canvas ref={el => (this.canvas = el)} onMouseMove={this.mouseMove} />
    );
  }
}

export default App;
