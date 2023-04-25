// Author: Barteld Van Nieuwenhove
// Date: 25/4/2023
import { buildings } from "./layout.js";

export function getBuildings(): THREE.Object3D<THREE.Event>[] {
    return buildings;
  }