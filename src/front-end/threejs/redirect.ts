import { BuildingNames } from '../threejs/dataToImport.js';

export function redirect(name: string) {
  switch (name) {
    case BuildingNames.nameacco:
      sessionStorage.setItem('aula', BuildingNames.nameacco);
      window.location.href = 'chatter/chat-window.html';
      break;
    case BuildingNames.namea200:
      sessionStorage.setItem('aula', BuildingNames.namea200);
      window.location.href = 'chatter/chat-window.html';
      break;
    case BuildingNames.namec200:
      sessionStorage.setItem('aula', BuildingNames.namec200);
      window.location.href = 'chatter/chat-window.html';
      break;
    case BuildingNames.namee200:
      sessionStorage.setItem('aula', BuildingNames.namee200);
      window.location.href = 'chatter/chat-window.html';
      break;
    case BuildingNames.namek200:
      sessionStorage.setItem('aula', BuildingNames.namek200);
      window.location.href = 'chatter/chat-window.html';
      break;
    case BuildingNames.namel200:
      sessionStorage.setItem('aula', BuildingNames.namel200);
      window.location.href = 'chatter/chat-window.html';
      break;
    case BuildingNames.namem200:
      sessionStorage.setItem('aula', BuildingNames.namem200);
      window.location.href = 'chatter/chat-window.html';
      break;
    case BuildingNames.namen200:
      sessionStorage.setItem('aula', BuildingNames.namen200);
      window.location.href = 'chatter/chat-window.html';
      break;
    case BuildingNames.names200:
      sessionStorage.setItem('aula', BuildingNames.names200);
      window.location.href = 'chatter/chat-window.html';
      break;
    case BuildingNames.nameb200:
      sessionStorage.setItem('aula', BuildingNames.nameb200);
      window.location.href = 'chatter/chat-window.html';
      break;
    case BuildingNames.namemoni:
      sessionStorage.setItem('aula', BuildingNames.namemoni);
      window.location.href = 'chatter/chat-window.html';
      break;
    case BuildingNames.namef200:
      sessionStorage.setItem('aula', BuildingNames.namef200);
      window.location.href = 'chatter/chat-window.html';
      break;
    case BuildingNames.nameh200:
      sessionStorage.setItem('aula', BuildingNames.nameh200);
      window.location.href = 'chatter/chat-window.html';
      break;
    case BuildingNames.namenano:
      sessionStorage.setItem('aula', BuildingNames.namenano);
      window.location.href = 'chatter/chat-window.html';
      break;
    case BuildingNames.named200:
      sessionStorage.setItem('aula', BuildingNames.named200);
      window.location.href = 'chatter/chat-window.html';
      break;
    default:
      break;
  }
}
