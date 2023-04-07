let i = 0;
const bar = document.querySelector('.progress-bar') as HTMLElement;
function makeProgress(): void {
  if (i < 100) {
    i = i + 1;
    bar.style.width = i.toString() + '%';
    bar.innerText = i.toString() + '%';
  } else {
    i = 0;
    bar.style.width = i.toString() + '%';
    bar.innerText = i.toString() + '%';
  }
  // Wait for sometime before running this script again
  setTimeout(makeProgress, 36000);
}
makeProgress();
