import * as THREE from 'three';
// initialize the scene
const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(100, window.innerWidth / window.innerHeight, 0.1, 1000);

  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  // create the cube and add it to the scene
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = [
    new THREE.MeshBasicMaterial( { color: 0x00ff00 } ),
    new THREE.MeshBasicMaterial( { color: 0xff0000 } ),
    new THREE.MeshBasicMaterial( { color: 0x0000ff } ),
    new THREE.MeshBasicMaterial( { color: 0xffff00 } ),
    new THREE.MeshBasicMaterial( { color: 0x00ffff } ),
    new THREE.MeshBasicMaterial( { color: 0xff00ff } ) ];
  const cube = new THREE.Mesh(geometry, material);
  scene.add(cube);

  camera.position.z = 3;

  // create the clock instance to keep track of the time since the last key press
  const clock = new THREE.Clock();

  // initialize the event listener to see when and what button is pressed
  const rotX = 0.1;
  const rotY = 0.1;
  document.addEventListener('keydown', function (e) {
    clock.stop()
    clock.start()
    if (e.keyCode === 37) { // left
      cube.rotation.y -= rotY;
    } else if (e.keyCode === 38) { // up
      cube.rotation.x += rotX;
    } else if (e.keyCode === 39) { // right
      cube.rotation.y += rotY;
    } else if (e.keyCode === 40) { // down 
      cube.rotation.x -= rotX;
    }
  });


  clock.start(); // start the clock for the first time
  // animating the frame every refresh and depending if enough time has gone by to activate the idle animation
  function animate() {
    requestAnimationFrame( animate );
    if (clock.getElapsedTime() > 5){
      cube.rotation.x += easeInOutQuad(2* Math.PI / 180);
      cube.rotation.y += easeInOutQuad(2 * Math.PI / 180);

    }
    renderer.render( scene, camera );
  }

  function easeInOutQuad(x: number) {
      return x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2;
    }

  animate();