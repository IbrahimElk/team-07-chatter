import * as THREE from 'three';
export declare function makeTree(posX: number, posZ: number, kindOfTree: number, size: number): void;
export declare function makeMaterial(mycolor: number): THREE.MeshStandardMaterial;
export declare function makeGeo(xlength: number, height: number, zlength: number, xpos: number, zpos: number): THREE.BoxGeometry;
export declare function makeBench(xpos: number, zpos: number, rotation: number): void;
export declare function finishingTouches(building: THREE.Mesh | THREE.Group, name: string, layer: number, castShadowB: boolean): void;
export declare function makePath(xlength: number, zlength: number, xpos: number, zpos: number, ydregree: number): void;
export declare function makeParking(xlength: number, zlength: number, xpos: number, zpos: number, ydregree: number): void;
//# sourceMappingURL=functionsForLayout.d.ts.map