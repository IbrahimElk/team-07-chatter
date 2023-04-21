// Author: Maité Desmedt

import { BuildingNames } from "./dataToImport.js";

// Date: 18/4/2023
export function showPopup(name:string){
  (document.querySelector(".text") as HTMLElement).textContent = "";
  if(name === BuildingNames.nameacco){
    (document.querySelector(".text") as HTMLElement).append("This building is called " +  name +". If you click on this building, a list of all your friends will be shown." );
  }else{
    (document.querySelector(".text") as HTMLElement).append("This building is called " +  name +". If you click on this building, you will be redirected to the chat window of this building." );
  }
  //(document.querySelector(".popup") as HTMLElement).style.display = 'block';
}

export function hidePopup(){
  (document.querySelector(".text") as HTMLElement).textContent = "";

}