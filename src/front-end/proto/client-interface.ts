// @author John Gao, Ibrahim El Kaddouri
// @date 2022-11-21

import { z } from 'zod';
/**
 * All the interfaces that the client can send to the server.
 * Each interface contains a command, which identifies the type of the interface
 * and a payload, containing the information useful to the server.
 */

// -------------------------------------------------------------------------------
// ALGEMEEN
// -------------------------------------------------------------------------------

export const ErrorSchema = z.object({
  command: z.literal('ERROR'),
  payload: z.object({
    Status: z.string(),
  }),
});

export const logIn = z.object({
  command: z.literal('logIn'),
  payload: z.object({
    sessionID: z.string(),
    usernameUUID: z.string(),
    password: z.string(),
  }),
});
export const logOut = z.object({
  command: z.literal('logOut'),
  payload: z.object({
    sessionID: z.string(),
  }),
});
export const settings = z.object({
  command: z.literal('settings'),
  payload: z.object({
    sessionID: z.string(),
    newUsername: z.string(),
    profileLink: z.string(),
  }),
});

export const registration = z.object({
  command: z.literal('registration'),
  payload: z.object({
    sessionID: z.string(),
    usernameUUID: z.string(),
    password: z.string(),
  }),
});

export const validateSession = z.object({
  command: z.literal('validateSession'),
  payload: z.object({
    sessionID: z.string(),
  }),
});

export const requestTimetable = z.object({
  command: z.literal('requestTimetable'),
  payload: z.object({
    sessionID: z.string(),
    authenticationCode: z.string(),
  }),
});

export const getList = z.object({
  command: z.literal('getList'),
  payload: z.object({
    sessionID: z.string(),
    string: z.string(),
  }),
});

export const updateSettings = z.object({
  command: z.literal('updateSettings'),
  payload: z.object({
    sessionID: z.string(),
    profilePicture: z.string(), //LINK
    username: z.string(),
  }),
});

// -------------------------------------------------------------------------------
// FRIENDS
// -------------------------------------------------------------------------------

export const addFriend = z.object({
  command: z.literal('addFriend'),
  payload: z.object({
    sessionID: z.string(),
    friendUUID: z.string(),
  }),
});

export const selectFriend = z.object({
  command: z.literal('SelectFriend'),
  payload: z.object({
    sessionID: z.string(),
    friendUUID: z.string(),
  }),
});

export const removeFriend = z.object({
  command: z.literal('removeFriend'),
  payload: z.object({
    sessionID: z.string(),
    friendUUID: z.string(),
  }),
});

export const friendMessage = z.object({
  command: z.literal('friendMessage'),
  payload: z.object({
    sessionID: z.string(),
    channelID: z.string(),
    text: z.string(),
    date: z.string(),
    NgramDelta: z.array(z.tuple([z.string(), z.number()])),
  }),
});

// -------------------------------------------------------------------------------
// CHANNELS
// -------------------------------------------------------------------------------

export const selectChannel = z.object({
  command: z.literal('selectChannel'),
  payload: z.object({
    sessionID: z.string(),
    channelCUID: z.string(),
  }),
});

export const disconnectChannel = z.object({
  command: z.literal('disconnectChannel'),
  payload: z.object({
    sessionID: z.string(),
    channelCUID: z.string(),
  }),
});

export const channelMessage = z.object({
  command: z.literal('channelMessage'),
  payload: z.object({
    sessionID: z.string(),
    channelName: z.string(),
    text: z.string(),
    date: z.string(),
    NgramDelta: z.array(z.tuple([z.string(), z.number()])),
  }),
});

export const verification = z.object({
  command: z.literal('verification'),
  payload: z.object({
    sessionID: z.string(),
    NgramDelta: z.array(z.tuple([z.string(), z.number()])),
  }),
});

//FIXME: bijvoegen schemas in z.union
export const MessageSchema = z.union([
  logIn,
  verification,
  logOut,
  registration,
  validateSession,
  requestTimetable,
  addFriend,
  selectFriend,
  removeFriend,
  selectChannel,
  getList,
  friendMessage,
  channelMessage,
  ErrorSchema,
  settings,
]);
