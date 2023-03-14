let element_id: number;

export function showNotification(sender: string) {
  if (typeof window === 'object') {
    document.addEventListener('DOMContentLoaded', function () {
      const element = document.getElementById('myToast') as HTMLElement;
      const body = document.getElementById('toastbody') as HTMLElement;
      if (!element.classList.contains('show')) {
        element.classList.add('show');
        const name = sender;
        const message = 'You just received a message from ' + name;
        body.innerText = message;
        element_id = window.setTimeout(function () {
          element.classList.remove('show');
        }, 6000);
      }
    });
  }
}

export function closeNotification() {
  if (typeof window === 'object') {
    const element = document.getElementById('myToast') as HTMLElement;
    if (element_id) clearTimeout(element_id);
    element.classList.remove('show');
  }
}
