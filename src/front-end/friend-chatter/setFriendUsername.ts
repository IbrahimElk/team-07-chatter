window.addEventListener('load', () => {
  const username = sessionStorage.getItem('friendUUID') as string;
  (document.getElementById('friendUsername') as HTMLElement).textContent = username;
});
