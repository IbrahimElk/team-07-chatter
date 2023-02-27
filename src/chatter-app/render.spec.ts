// author: Thomas Evenepoel, El Kaddouri Ibrahim
// date: 2023-02-25
import * as THREE from 'three';
import { describe, it, expect, beforeEach } from 'vitest';
import { JSDOM } from 'jsdom';
import { KeyPressHandler, easeInOutQuad } from './functions.js';

describe('Cube rotation', () => {
  //initialize virtual dom environment
  const geometry = new THREE.BoxGeometry(1.999, 1.999, 1.999);
  const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
  const cube = new THREE.Mesh(geometry, material);

  const dom = new JSDOM('<!DOCTYPE html>');
  const document = dom.window.document;
  const window = dom.window;
  const timerObj = { time: Date.now() };
  KeyPressHandler(document, cube, timerObj);

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

describe('easing function', () => {
  it('check output given input', () => {
    expect(easeInOutQuad(0.5)).toEqual(1 - Math.pow(-2 * 0.5 + 2, 2) / 2);
    expect(easeInOutQuad(0.4)).toEqual(2 * 0.4 * 0.4);
    expect(easeInOutQuad(1.2)).toEqual(1 - Math.pow(-2 * 1.2 + 2, 2) / 2);
  });
});
