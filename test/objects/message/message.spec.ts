import { Message } from './message.js';
import { User } from '../user/user.js';
import { describe, it, expect } from 'vitest';
import { MockWebSocket } from '../../front-end/proto/__mock__/ws-mock.js';

describe('Message', () => {
  const user = new User('Jan', 'mijnAndereWachtwoord');
  user.setWebsocket(new MockWebSocket('FAKE_URL_2'));
  const date = new Date().getTime().toString();
  const text = 'Hello, world!';

  const message = new Message(user, date, text, 0);

  it('should retrieve a MUID', () => {
    expect(message.getMUID()).toBeTypeOf('string');
  });

  it('should retrieve the correct user name', () => {
    expect(message.getUUID()).toBe(user.getUUID());
  });

  it('should retrieve the correct date', () => {
    expect(message.getDate()).toBe(date);
  });

  it('should retrieve the correct text', () => {
    expect(message.getText()).toBe(text);
  });
});
