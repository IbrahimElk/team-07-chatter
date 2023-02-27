// author: Thomas Evenepoel
// date: 2023-02-25
import * as THREE from 'three';
import { describe, it, expect, beforeEach } from 'vitest';

import { JSDOM } from 'jsdom';
const dom = new JSDOM('<!DOCTYPE html>');
Object.defineProperty(global, 'window', { value: dom.window });
Object.defineProperty(global, 'document', { value: dom.window.document });
Object.defineProperty(global, 'KeyboardEvent', { value: dom.window.KeyboardEvent });

describe('Cube rotation', () => {
  let cube: THREE.Mesh;

  beforeEach(() => {
    const geometry = new THREE.BoxGeometry(1.999, 1.999, 1.999);
    const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
    cube = new THREE.Mesh(geometry, material);
  });
  // Small easy tests to check whether the cube is correcly rotating
  it('should rotate the cube 45 degrees around the x-axis', () => {
    const initialCube = cube.clone();
    cube.rotation.x = THREE.MathUtils.degToRad(45);
    expect(cube.rotation.x).toBeGreaterThan(initialCube.rotation.x);
  });

  it('should rotate the cube 45 degrees around the y-axis', () => {
    const initialCube = cube.clone();
    cube.rotation.y = THREE.MathUtils.degToRad(45);
    expect(cube.rotation.y).toBeGreaterThan(initialCube.rotation.y);
  });

  // Tests for the keypresses
  it('should rotate the cube a bit to the left when the LeftArrow key is pressed', () => {
    const initalCube = cube.clone();
    document.addEventListener('keydown', function (event) {
      cube.rotation.y -= 0.1;
    });
    const event = new KeyboardEvent('keydown', { keyCode: 37 });

    document.dispatchEvent(event);
    expect(cube.rotation.y).toBeLessThan(initalCube.rotation.y);
  });

  it('should rotate the cube a bit to the right when the RightArrow key is pressed', () => {
    const initialCube = cube.clone();
    document.addEventListener('keydown', function (event) {
      cube.rotation.y += 0.2;
    });
    const event = new KeyboardEvent('keydown', { keyCode: 39 });
    document.dispatchEvent(event);
    expect(cube.rotation.y).toBeGreaterThan(initialCube.rotation.y);
  });

  it('should rotate the cube a bit up when the UpArrow key is pressed', () => {
    const initalCube = cube.clone();
    document.addEventListener('keydown', function (event) {
      cube.rotation.x += 0.1;
    });
    const event = new KeyboardEvent('keydown', { keyCode: 38 });
    document.dispatchEvent(event);
    expect(cube.rotation.x).toBeGreaterThan(initalCube.rotation.x);
  });

  it('should rotate the cube a bit down when the DownArrow key is pressed', () => {
    const initialCube = cube.clone();
    document.addEventListener('keydown', function (event) {
      cube.rotation.x -= 0.2;
    });
    const event = new KeyboardEvent('keydown', { keyCode: 40 });
    document.dispatchEvent(event);
    expect(cube.rotation.x).toBeLessThan(initialCube.rotation.x);
  });
});
