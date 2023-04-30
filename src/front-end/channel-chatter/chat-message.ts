//TODO: voeg de waardes al toe aan de functie ipv ze hier op te roepen
//TODO: deze functie oproepen en alle berichten toevoegen

/**
 * This function sends a messgae with the content from the input bar.
 * It only sends a message whenever there is input to be send.
 * Right now no timings are implemented and different features are still placeholders but the base is there.
 */
export function showMessage(date: string, sender: string, text: string, trust: number): void {
  let trustColor: string;
  if (trust > 75) {
    trustColor = 'bg-success';
  } else if (trust > 25) {
    trustColor = 'bg-warning';
  } else {
    trustColor = 'bg-danger';
  }
  const trustLevel = trust.toString() + '%';
  const temp1: HTMLTemplateElement | null = document.getElementById('message') as HTMLTemplateElement | null;
  if (!temp1) {
    return;
  }
  const copyHTML: DocumentFragment = document.importNode(temp1.content, true);

  (copyHTML.querySelector('.mb-1') as HTMLElement).textContent = sender;
  (copyHTML.querySelector('.text-muted.d-flex.align-items-end') as HTMLElement).textContent = date;
  (copyHTML.querySelector('.h5.mb-1') as HTMLElement).textContent = text;
  (copyHTML.querySelector('.progress-bar') as HTMLElement).style.height = trustLevel;
  (copyHTML.querySelector('.progress-bar') as HTMLElement).classList.add(trustColor);
  const messageList: HTMLElement | null = document.getElementById('messageList');
  if (!messageList) {
    return;
  }
  const firstChild: Element | null = messageList.firstElementChild;
  if (firstChild) {
    messageList.insertBefore(copyHTML, firstChild);
  } else {
    messageList.appendChild(copyHTML);
  }
}
