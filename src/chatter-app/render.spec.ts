// author: Thomas Evenepoel, El Kaddouri Ibrahim
// date: 2023-02-25
import * as THREE from 'three';
import { describe, it, expect, beforeEach } from 'vitest';
import { JSDOM } from 'jsdom';
// import { KeyPressHandler } from './chatter-app/render.js';

function KeyPressHandler(documentParam: Document, Kubus: THREE.Mesh<THREE.BoxGeometry, THREE.MeshStandardMaterial>) {
  documentParam.addEventListener('keydown', function (event) {
    // timer = Date.now();
    // console.log(event.key);
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
describe('Cube rotation', () => {
  //initialize virtual dom environment
  const geometry = new THREE.BoxGeometry(1.999, 1.999, 1.999);
  const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
  const cube = new THREE.Mesh(geometry, material);

  const dom = new JSDOM('<!DOCTYPE html>');
  const document = dom.window.document;
  const window = dom.window;
  KeyPressHandler(document, cube);

  // Tests for the keypresses
  it('should rotate the cube a bit to the left when the LeftArrow key is pressed', () => {
    const initalCube = cube.clone();
    const event = new window.KeyboardEvent('keydown', { key: 'ArrowLeft' });
    document.dispatchEvent(event);
    expect(cube.rotation.y).toBeLessThan(initalCube.rotation.y);
  });

  it('should rotate the cube a bit to the right when the RightArrow key is pressed', () => {
    const initialCube = cube.clone();
    const event = new window.KeyboardEvent('keydown', { key: 'ArrowRight' });
    document.dispatchEvent(event);
    expect(cube.rotation.y).toBeGreaterThan(initialCube.rotation.y);
  });

  it('should rotate the cube a bit up when the UpArrow key is pressed', () => {
    const initalCube = cube.clone();
    const event = new window.KeyboardEvent('keydown', { key: 'ArrowDown' });
    document.dispatchEvent(event);
    expect(cube.rotation.x).toBeGreaterThan(initalCube.rotation.x);
  });

  it('should rotate the cube a bit down when the DownArrow key is pressed', () => {
    const initialCube = cube.clone();
    const event = new window.KeyboardEvent('keydown', { key: 'ArrowUp' });
    document.dispatchEvent(event);
    expect(cube.rotation.x).toBeLessThan(initialCube.rotation.x);
  });
});
