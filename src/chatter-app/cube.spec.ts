import * as THREE from 'three';
import { describe, it, expect } from 'vitest';
import { JSDOM } from 'jsdom';
//import { keydown } from '../chatter-app/cube.js';


export function keydown(document: Document, cube: THREE.Mesh<THREE.BoxGeometry, THREE.MeshBasicMaterial>, line: THREE.LineSegments<THREE.EdgesGeometry,THREE.LineBasicMaterial> ){
  document.addEventListener('keydown', function (event) {
    //idletime = 0;
    if (event.key === 'ArrowLeft') {
      //left
      cube.rotation.y -= 0.1;
      line.rotation.y -= 0.1;
    } else if (event.key === 'ArrowUp') {
      //top
      cube.rotation.x -= 0.1;
      line.rotation.x -= 0.1;
    } else if (event.key === 'ArrowRight') {
      //right
      cube.rotation.y += 0.1;
      line.rotation.y += 0.1;
    } else if (event.key === 'ArrowDown') {
      //bottom
      cube.rotation.x += 0.1;
      line.rotation.x += 0.1;
    }
  });
}

describe('cube', () => {
    const dom = new JSDOM('<!DOCTYPE html>');
    const document = dom.window.document;
    const window = dom.window;

    const geometry= new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cube= new THREE.Mesh(geometry, material);
    const edges = new THREE.EdgesGeometry(geometry);
    const line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0x000000 }));

    keydown(document,cube,line);

    //tests if the 'keydown' is working
    it('rotates the cube when the ArrowLeft key is pressed', () => {
        const cloneCube = cube.clone();
        const cloneLine = line.clone();
        var event = new window.KeyboardEvent('keydown', {key : 'ArrowLeft'});
        document.dispatchEvent(event);
        expect(cube.rotation.y).toBe(cloneCube.rotation.y-0.1);
        expect(line.rotation.y).toBe(cloneLine.rotation.y-0.1);
      });
    
    it('rotates the cube when the ArrowUp key is pressed', () => {
        const cloneCube = cube.clone();
        const cloneLine = line.clone();
        var event = new window.KeyboardEvent('keydown', {key : 'ArrowUp'});
        document.dispatchEvent(event);
        expect(cube.rotation.x).toBe(cloneCube.rotation.x-0.1);
        expect(line.rotation.x).toBe(cloneLine.rotation.x-0.1);
      });
    
    it('rotates the cube when the ArrowRight key is pressed', () => {
        const cloneCube = cube.clone();
        const cloneLine = line.clone();
        var event = new window.KeyboardEvent('keydown', {key : 'ArrowRight'});
        document.dispatchEvent(event);
        expect(cube.rotation.y).toBeGreaterThan(cloneCube.rotation.y+0.1);
        expect(line.rotation.y).toBeGreaterThan(cloneLine.rotation.y+0.1);
      });

    it('rotates the cube when the ArrowDown key is pressed', () => {
        const cloneCube = cube.clone();
        const cloneLine = line.clone();
        var event = new window.KeyboardEvent('keydown', {key : 'ArrowDown'});
        document.dispatchEvent(event);
        expect(cube.rotation.x).toBeLessThan(cloneCube.rotation.x+0.1);
        expect(line.rotation.x).toBeLessThan(cloneLine.rotation.x+0.1);
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
