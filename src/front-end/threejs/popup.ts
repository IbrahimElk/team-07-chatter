export function showPopup(name:string){
  (document.querySelector(".text") as HTMLElement).textContent = "";
  (document.querySelector(".text") as HTMLElement).append("This is building " +  name +" and there are no lessons given in this building at the moment" );
  //(document.querySelector(".popup") as HTMLElement).style.display = 'block';
}

export function hidePopup(){
  (document.querySelector(".text") as HTMLElement).textContent = "";

}