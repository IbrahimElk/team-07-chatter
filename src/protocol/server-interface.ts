// @author John Gao
// @date 2022-11-21

import { z } from 'zod';

/**
 * All the interfaces that the server can send to the client.
 * Each interface contains a command, which identifies the type of the interface
 * and a payload, containing the information useful to the client.
 */

//TODO: UPDATE
// VRAGEN AAN PROF/ASSISTENT WAT EEN BETERE DATATYPE IS.a
export const Schema =
  //:schemaType
  {
    loginSendback: 'loginSendback',
    registrationSendback: 'registrationSendback',
    addFriendSendback: 'addFriendSendback',
    selectFriendSendback: 'selectFriendSendback',
    removeFriendSendback: 'removeFriendSendback',
    exitFriendSendback: 'exitFriendSendback',
    joinChannelSendback: 'joinChannelSendback',
    exitChannelSendback: 'exitChannelSendback',
    leaveChannelSendback: 'leaveChannelSendback',
    selectChannelSendback: 'selectChannelSendback',
    getListSendback: 'getListSendback',
    friendMessageSendback: 'friendMessageSendback',
    ErrorSchema: 'ERROR',
    exitMeSendback: 'exitMeSendback',
  };

export const registrationSendback = z.object({
  command: z.literal('registrationSendback'),
  payload: z.object({
    succeeded: z.boolean(),
    typeOfFail: z.optional(z.string()),
  }),
});

export const loginSendback = z.object({
  command: z.literal('loginSendback'),
  payload: z.object({
    succeeded: z.boolean(),
    typeOfFail: z.optional(z.string()),
  }),
});

export const exitMeSendback = z.object({
  command: z.literal('exitMeSendback'),
  payload: z.object({
    succeeded: z.boolean(),
    typeOfFail: z.optional(z.string()),
  }),
});

export const addFriendSendback = z.object({
  command: z.literal('addFriendSendback'),
  payload: z.object({
    succeeded: z.boolean(),
    typeOfFail: z.optional(z.string()),
  }),
});

export const selectFriendSendback = z.object({
  command: z.literal('selectFriendSendback'),
  payload: z.object({
    succeeded: z.boolean(),
    typeOfFail: z.optional(z.string()),
    messages: z.array(z.object({ sender: z.string(), text: z.string(), date: z.string() })),
  }),
});

export const removeFriendSendback = z.object({
  command: z.literal('removeFriendSendback'),
  payload: z.object({
    succeeded: z.boolean(),
    typeOfFail: z.optional(z.string()),
  }),
});

export const exitFriendSendback = z.object({
  command: z.literal('exitFriendSendback'),
  payload: z.object({
    succeeded: z.boolean(),
    typeOfFail: z.optional(z.string()),
  }),
});

export const joinChannelSendback = z.object({
  command: z.literal('joinChannelSendback'),
  payload: z.object({
    succeeded: z.boolean(),
    typeOfFail: z.optional(z.string()),
  }),
});

export const selectChannelSendback = z.object({
  command: z.literal('selectChannelSendback'),
  payload: z.object({
    succeeded: z.boolean(),
    typeOfFail: z.optional(z.string()),
  }),
});

export const leaveChannelSendback = z.object({
  command: z.literal('leaveChannelSendback'),
  payload: z.object({
    succeeded: z.boolean(),
    typeOfFail: z.optional(z.string()),
  }),
});

export const exitChannelSendback = z.object({
  command: z.literal('exitChannelSendback'),
  payload: z.object({
    succeeded: z.boolean(),
    typeOfFail: z.optional(z.string()),
  }),
});

export const getListSendback = z.object({
  command: z.literal('getListSendback'),
  payload: z.object({
    succeeded: z.boolean(),
    list: z.array(z.string()),
    typeOfFail: z.optional(z.string()),
  }),
});

// export const friendMessageSendback = z.object({
//   command: z.literal(Schema.friendMessageSendback),
//   payload: z.object({
//     sender: z.string(),
//     text: z.string(),
//     date: z.string(),
//   }),
// });

export const createDirectChannelSendback = z.object({
  command: z.literal('createDirectChannelSendback'),
  payload: z.object({
    succeeded: z.boolean(),
    typeOfFail: z.optional(z.string()),
  }),
});

export const deleteChannelSendback = z.object({
  command: z.literal('deleteChannelSendback'),
  payload: z.object({
    succeeded: z.boolean(),
    typeOfFail: z.optional(z.string()),
  }),
});

// Ibrahim: Zelf toegevoegd, check nog of volledig
export const ErrorSchema = z.object({
  command: z.literal('ERROR'),
  payload: z.object({
    Status: z.string(),
  }),
});

export const friendMessageSendback = z.object({
  command: z.literal('friendMessageSendback'),
  payload: z.object({
    sender: z.string(), // selectfriend, verwacht historie,
    text: z.string(), //  frendmessage, lijst met 1 element
    date: z.string(),
  }),
});

//FIXME: bijvoegen schemas in z.union
export const MessageSchema = z.union([
  registrationSendback,
  loginSendback,
  selectFriendSendback,
  removeFriendSendback,
  exitFriendSendback,
  joinChannelSendback,
  selectChannelSendback,
  leaveChannelSendback,
  exitChannelSendback,
  getListSendback,
  addFriendSendback,
  friendMessageSendback,
  ErrorSchema,
  exitMeSendback,
]);
