var THREE = (window.THREE = require("three"));
require("three/examples/js/loaders/SVGLoader");

function loadLogo(cb) {
  const loader = new THREE.SVGLoader();

  loader.load("assets/svg/LFL_Mono_Black.svg", paths => {
    var group = new THREE.Group();
    group.scale.multiplyScalar(0.7);
    group.position.x = -280;
    group.position.y = 230;
    group.scale.y *= -1;

    cb(group, paths)
  })
}

export default loadLogo