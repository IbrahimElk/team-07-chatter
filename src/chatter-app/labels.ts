// // @ts-ignore
// import * as THREE from 'three';
// // @ts-ignore
// import { CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';
// import {acco} from './layout.js';
// import type {CSS2DObject} from 'three/addons/renderers/CSS2DRenderer.js';

// // labels for the buildings
// const m200Div = document.createElement('div');
// const m200Label = makeLabel(m200Div, "200M", "black");
// m200Label.position.set(-6, hlm200*1.5, -3.75);
// //m200.add(m200Label);

// const s200Div = document.createElement('div');
// const s200Label = makeLabel(s200Div, "200S", "black");
// s200Label.position.set(-7.2, hs200*1.5, -3.65);
// //s200.add(s200Label);

// const l200Div = document.createElement('div');
// const l200Label = makeLabel(l200Div, "200L", "black");
// l200Label.position.set(-8.15, hlm200*1.5, -3.3);
// //l200.add(l200Label);

// const k200Div = document.createElement('div');
// const k200Label = makeLabel(k200Div, "200K", "black");
// k200Label.position.set(-9.85, hk200*1.5, -0.65);
// //k200.add(k200Label);

// const a200Div = document.createElement('div');
// const a200Label = makeLabel(a200Div, "200A", "black");
// a200Label.position.set(-7.2, ha200*1.5, 1.4);
// //a200Group.add(a200Label);

// const accoDiv = document.createElement('div');
// const accoLabel: CSS2DObject = makeLabel(accoDiv, "ACCO", "black");
// accoLabel.position.set(-11, hacco*1.5, 0.25);
// //acco.add(accoLabel);

// const n200Div = document.createElement('div');
// const n200Label = makeLabel(n200Div, "200N" + "\n" + "test", "black");
// n200Label.position.set(-4.25, hn200*1.5, -2.4);
// //n200.add(n200Label);

// const e200Div:HTMLDivElement = document.createElement('div');
// const e200Label = makeLabel(e200Div, "200E", "black");
// e200Label.position.set(2.9, he200*1.5, 2.65);
// //e200.add(e200Label);

// const c200Div = document.createElement('div');
// const c200Label = makeLabel(c200Div, "200C", "black");
// c200Label.position.set(-2, hc200*1.5, 2.6);
// //c200Group.add(c200Label);

// function makeLabel(element:HTMLDivElement, text:string, color:string):CSS2DObject{
//   element.className = 'label';
//   element.textContent = text;
//   element.style.marginTop = '-lem';
//   element.style.color = color;
//   const label:CSS2DObject = new CSS2DObject(element);
//   return label;
// }

// export function showLabel(building:THREE.Mesh){
//   switch (building) {
//     case "acco":
//       acco.add(accoLabel);
//       break;
//     case a200Group:
//       a200Group.add(a200Label);
//       break;
//     case c200Group:
//       c200Group.add(c200Label);
//       break;
//     case e200:
//       e200.add(e200Label);
//       break;
//     case k200:
//       k200.add(k200Label);
//       break;
//     case l200:
//       l200.add(l200Label);
//       break;
//     case m200:
//       m200.add(m200Label);
//       break;
//     case n200:
//       n200.add(n200Label);
//       break;
//     case s200:
//       s200.add(s200Label);
//       break;
//     default:
//       break;
//   }
// }
// export function hideLabel(building:THREE.Mesh){
//   switch (building) {
//     case acco:
//       acco.remove(accoLabel);
//       break;
//     case a200Group:
//       a200Group.remove(a200Label);
//       break;
//     case c200Group:
//       c200Group.remove(c200Label);
//       break;
//     case e200:
//       e200.remove(e200Label);
//       break;
//     case k200:
//       k200.remove(k200Label);
//       break;
//     case l200:
//       l200.remove(l200Label);
//       break;
//     case m200:
//       m200.remove(m200Label);
//       break;
//     case n200:
//       n200.remove(n200Label);
//       break;
//     case s200:
//       s200.remove(s200Label);
//       break;
//     default:
//       break;
//   }
// }
