// Author: John Gao
// Date: 12/12/2022

import * as CI from '../chat-client/client-interfaces.js';
import type * as ServerInterfaceTypes from '../protocol/protocol-types-server.js';
import { expect, vi, describe, it } from 'vitest';
import {
  addFriendSendback,
  getListSendback,
  printobject,
  PromiseloginSendback,
  PromiseregistrationSendback,
  removeFriendSendback,
  selectFriendSendback,
} from '../chat-client/client-dispatcher-functions.js';
// import { login } from './client-login.js';
import * as CL from '../chat-client/client-login.js';
function addfriendsendbackfalse() {
  const addfriendsendback: ServerInterfaceTypes.addFriendSendback = {
    command: 'addFriendSendback',
    payload: { succeeded: false },
  };
  addFriendSendback(addfriendsendback.payload);
}

function addfriendsendbacktrue() {
  const addfriendsendback: ServerInterfaceTypes.addFriendSendback = {
    command: 'addFriendSendback',
    payload: { succeeded: true },
  };
  addFriendSendback(addfriendsendback.payload);
}

function removefriendsendbackfalse() {
  const removefriendsendback: ServerInterfaceTypes.removeFriendSendback = {
    command: 'removeFriendSendback',
    payload: { succeeded: false },
  };
  removeFriendSendback(removefriendsendback.payload);
}

function removefriendsendbacktrue() {
  const removefriendsendback: ServerInterfaceTypes.removeFriendSendback = {
    command: 'removeFriendSendback',
    payload: { succeeded: true },
  };
  removeFriendSendback(removefriendsendback.payload);
}

async function selectfriendsendbackfalse() {
  const selectfriendsendback: ServerInterfaceTypes.selectFriendSendback = {
    command: 'selectFriendSendback',
    payload: { succeeded: false, messages: [] },
  };
  await selectFriendSendback(selectfriendsendback.payload);
}

async function selectfriendsendbacktrue() {
  const selectfriendsendback: ServerInterfaceTypes.selectFriendSendback = {
    command: 'selectFriendSendback',
    payload: { succeeded: true, messages: [] },
  };
  await selectFriendSendback(selectfriendsendback.payload);
}

function getlistsendbackfalse() {
  const getlistsendback: ServerInterfaceTypes.getListSendback = {
    command: 'getListSendback',
    payload: { succeeded: false, list: [] },
  };
  getListSendback(getlistsendback.payload);
}

function getlistsendbacktrue() {
  const getlistsendback: ServerInterfaceTypes.getListSendback = {
    command: 'getListSendback',
    payload: { succeeded: true, list: [] },
  };
  getListSendback(getlistsendback.payload);
}

async function registersendbackfalse() {
  const registersendback: ServerInterfaceTypes.registrationSendback = {
    command: 'registrationSendback',
    payload: { succeeded: false },
  };
  await PromiseregistrationSendback(registersendback.payload);
}

async function registersendbacktrue() {
  const registersendback: ServerInterfaceTypes.registrationSendback = {
    command: 'registrationSendback',
    payload: { succeeded: true },
  };
  await PromiseregistrationSendback(registersendback.payload);
}

async function loginsendbackfalse() {
  const loginsendback: ServerInterfaceTypes.loginSendback = {
    command: 'loginSendback',
    payload: { succeeded: false },
  };
  await PromiseloginSendback(loginsendback.payload);
}

async function loginsendbacktrue() {
  const loginsendback: ServerInterfaceTypes.loginSendback = {
    command: 'loginSendback',
    payload: { succeeded: true },
  };
  await PromiseloginSendback(loginsendback.payload);
}

/**
 * Some unit tests for client dispatcher functions.
 * Check if given the boolean in the payload, the correct functions are called.
 * FIXME: werkt niet zonder ofwel server op te starten, ofwel chat-client.ts in commentaar te zetten
 * FIXME: werkt niet zonder LOGINOFREGISTRATIE in commentaar te zetten in client-login.ts
 */
describe('JSON sent by server is correctly processed', () => {
  it('addfriendsendback is processed correctly', () => {
    const spyOnaddFriendfalse = vi.spyOn(CI, 'addFriend');
    const spyOnaddFriendtrue = vi.spyOn(CI, 'startinterfaces');
    addfriendsendbackfalse();
    expect(spyOnaddFriendfalse).toHaveBeenCalledOnce();
    expect(spyOnaddFriendtrue).toHaveBeenCalledTimes(0);
    addfriendsendbacktrue();
    expect(spyOnaddFriendfalse).toHaveBeenCalledOnce();
    expect(spyOnaddFriendtrue).toHaveBeenCalledOnce();
  });
  it('removefriendsendback is processed correctly', () => {
    const spyOnremoveFriendfalse = vi.spyOn(CI, 'removeFriend');
    const spyOnremoveFriendtrue = vi.spyOn(CI, 'startinterfaces');
    removefriendsendbackfalse();
    expect(spyOnremoveFriendfalse).toHaveBeenCalledOnce();
    expect(spyOnremoveFriendtrue).toHaveBeenCalledTimes(0);
    removefriendsendbacktrue();
    expect(spyOnremoveFriendfalse).toHaveBeenCalledOnce();
    expect(spyOnremoveFriendtrue).toHaveBeenCalledOnce();
  });
  it('selectfriendsendback is processed correctly', async () => {
    const spyOnPrint = vi.spyOn(printobject, 'func');
    const spyOnCF = vi.spyOn(CI, 'chatFunction');
    const spyOnSF = vi.spyOn(CI, 'selectFriend');
    await selectfriendsendbackfalse();
    expect(spyOnPrint).toHaveBeenCalledTimes(0);
    expect(spyOnCF).toHaveBeenCalledTimes(0);
    expect(spyOnSF).toHaveBeenCalledOnce();
    await selectfriendsendbacktrue();
    expect(spyOnPrint).toHaveBeenCalledOnce();
    expect(spyOnCF).toHaveBeenCalledOnce();
    expect(spyOnSF).toHaveBeenCalledOnce();
  });
  it('getlistsendback is processed correctly', () => {
    const spyOnSI = vi.spyOn(CI, 'startinterfaces');
    getlistsendbackfalse();
    expect(spyOnSI).toHaveBeenCalledTimes(0);
    getlistsendbacktrue();
    expect(spyOnSI).toHaveBeenCalledOnce();
  });
  it('registrationsendback is processed correctly', async () => {
    const spyOnSI = vi.spyOn(CI, 'startinterfaces');
    const spyOnSL = vi.spyOn(CL, 'startloginFunctions');
    await registersendbackfalse();
    expect(spyOnSI).toHaveBeenCalledTimes(0);
    expect(spyOnSL).toHaveBeenCalledOnce();
    await registersendbacktrue();
    expect(spyOnSI).toHaveBeenCalledOnce();
    expect(spyOnSL).toHaveBeenCalledOnce();
  });
  it('loginsendback is processed correctly', async () => {
    const spyOnSI = vi.spyOn(CI, 'startinterfaces');
    const spyOnSL = vi.spyOn(CL, 'startloginFunctions');
    await loginsendbackfalse();
    expect(spyOnSI).toHaveBeenCalledTimes(0);
    expect(spyOnSL).toHaveBeenCalledOnce();
    await loginsendbacktrue();
    expect(spyOnSI).toHaveBeenCalledOnce();
    expect(spyOnSL).toHaveBeenCalledOnce();
  });
});
