// Guust Luycx
// 29/04/2023

window.addEventListener('resize', () => resize());
window.addEventListener('load', () => resize());

/**
 * this function resizes the "messageList" list
 */
function resize() {
  const screenHeight = window.innerHeight;
  const cardHeightMessageList = screenHeight - 195;
  (document.getElementById('messageList') as HTMLElement).style.height = `${cardHeightMessageList}px`;
}
