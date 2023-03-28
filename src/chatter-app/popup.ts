export function showPopup(name:string){
  $( ".text" ).empty();
  $( ".popup" ).append( "<div class='text'><p>This is building " +  name +" and there are no lessons given in this building at the moment <strong>" + "</strong></p></div>" );
  $(".popup").show();
}

export function hidePopup(){
  $( ".text" ).empty();
}