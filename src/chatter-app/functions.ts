// author: El Kaddouri Ibrahim
// date: 2023-02-25
/**
 * This function adds an eventlistener for "keydown" and handles keypress events on a given Document object
 * and rotates a given THREE.Mesh object based on the pressed key.
 * @param documentParam A Document object representing the document in which the key press event should be handled.
 * @param Kubus A THREE.Mesh object representing the cube
 * @param timer An object with a time property representing the current time.
 * @returns void
 */
export function KeyPressHandler(
  documentParam: Document,
  Kubus: THREE.Mesh<THREE.BoxGeometry, THREE.MeshStandardMaterial>,
  timer: {
    time: number;
  }
): void {
  documentParam.addEventListener('keydown', function (event) {
    timer.time = Date.now();
    if (event.key === 'ArrowRight') {
      Kubus.rotation.y += 0.1;
    } else if (event.key === 'ArrowUp') {
      Kubus.rotation.x -= 0.1;
    } else if (event.key === 'ArrowLeft') {
      Kubus.rotation.y -= 0.1;
    } else if (event.key === 'ArrowDown') {
      Kubus.rotation.x += 0.1;
    }
  });
}

/**
 * This function applies the quadratic easing function to a given number x
 * @param x number
 * @returns number
 */
export function easeInOutQuad(x: number): number {
  return x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2;
}
