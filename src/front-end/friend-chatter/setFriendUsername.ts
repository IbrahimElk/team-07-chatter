document.addEventListener('load', () => {
  const username = sessionStorage.getItem('friend') as string;
  (document.getElementById('friendUsername') as HTMLElement).textContent = username;
});
