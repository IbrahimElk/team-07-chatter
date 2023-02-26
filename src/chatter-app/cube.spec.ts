import * as THREE from 'three';
import { describe, it, expect, beforeEach } from 'vitest';

import { JSDOM } from 'jsdom';
const dom = new JSDOM('<!DOCTYPE html>');

describe('cube', () => {
    const geometry= new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cube= new THREE.Mesh(geometry, material);
    const edges = new THREE.EdgesGeometry(geometry);
    const line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0x000000 }));

    //tests if the 'keydown' is working
    it('rotates the cube when the ArrowLeft key is pressed', () => {
        const cloneCube = cube.clone();
        const cloneLine = line.clone();
        var event = new KeyboardEvent('keydown', {keyCode : 37});
        document.dispatchEvent(event);
        expect(cube.rotation.y).toBe(cloneCube.rotation.y-0.1);
        expect(line.rotation.y).toBe(cloneLine.rotation.y-0.1);
      });
    
    it('rotates the cube when the ArrowUp key is pressed', () => {
        const cloneCube = cube.clone();
        const cloneLine = line.clone();
        var event = new KeyboardEvent('keydown', {keyCode : 38});
        document.dispatchEvent(event);
        expect(cube.rotation.x).toBe(cloneCube.rotation.x-0.1);
        expect(line.rotation.x).toBe(cloneLine.rotation.x-0.1);
      });
    
    it('rotates the cube when the ArrowRight key is pressed', () => {
        const cloneCube = cube.clone();
        const cloneLine = line.clone();
        var event = new KeyboardEvent('keydown', {keyCode : 39});
        document.dispatchEvent(event);
        expect(cube.rotation.y).toBe(cloneCube.rotation.y+0.1);
        expect(line.rotation.y).toBe(cloneLine.rotation.y+0.1);
      });

    it('rotates the cube when the ArrowDown key is pressed', () => {
        const cloneCube = cube.clone();
        const cloneLine = line.clone();
        var event = new KeyboardEvent('keydown', {keyCode : 40});
        document.dispatchEvent(event);
        expect(cube.rotation.x).toBe(cloneCube.rotation.x+0.1);
        expect(line.rotation.x).toBe(cloneLine.rotation.x+0.1);
      });
    /**
     * it('moves the cube if nobody is doing anything', () => {
        const cloneCube = cube.clone();
        const cloneLine = line.clone();
        if (idletime > 500) {
            expect(cube.rotation.y).toBe(cube.rotation.y+Math.min(ease(idletime / 15000), 0.03));
            
            line.rotation.y += Math.min(ease(idletime / 15000), 0.03);
            cube.rotation.x += Math.min(ease(idletime / 15000), 0.03);
            line.rotation.x += Math.min(ease(idletime / 15000), 0.03);
          }
        
      
      });
     */
    
     })
