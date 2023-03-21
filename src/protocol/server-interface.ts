// @author John Gao, Ibrahim El Kaddouri
// @date 3/11/2023

import { z } from 'zod';

/**
 * All the interfaces that the server can send to the client.
 * Each interface contains a command, which identifies the type of the interface
 * and a payload, containing the information useful to the client.
 */

// TODO: UPDATE selctchannel gaat ook fingerprinting terug moeten geven van vorige berichtne toch?

// -------------------------------------------------------------------------------
// ALGEMEEN
// -------------------------------------------------------------------------------

export const registrationSendback = z.object({
  command: z.literal('registrationSendback'),
  payload: z.union([
    z.object({
      succeeded: z.literal(true),
    }),
    z.object({ succeeded: z.literal(false), typeOfFail: z.string() }),
  ]),
});

export const loginSendback = z.object({
  command: z.literal('loginSendback'),
  payload: z.union([
    z.object({
      succeeded: z.literal(true),
    }),
    z.object({ succeeded: z.literal(false), typeOfFail: z.string() }),
  ]),
});

// Ibrahim: Zelf toegevoegd, check nog of volledig
// problemen met de server onafhankelijk van welk request verstuurd was. (typeoffail -> shuld van user, Errorschema -> schuld van server)
export const ErrorSchema = z.object({
  command: z.literal('ERROR'),
  payload: z.object({
    Status: z.string(),
  }),
});
// -------------------------------------------------------------------------------
// FRIENDS
// -------------------------------------------------------------------------------

export const selectFriendSendback = z.object({
  command: z.literal('selectFriendSendback'),
  payload: z.union([
    z.object({
      succeeded: z.literal(true),
      messages: z.array(z.object({ sender: z.string(), text: z.string(), date: z.string() })),
    }),
    z.object({ succeeded: z.literal(false), typeOfFail: z.string() }),
  ]),
});

export const addFriendSendback = z.object({
  command: z.literal('addFriendSendback'),
  payload: z.union([
    z.object({
      succeeded: z.literal(true),
    }),
    z.object({ succeeded: z.literal(false), typeOfFail: z.string() }),
  ]),
});

export const removeFriendSendback = z.object({
  command: z.literal('removeFriendSendback'),
  payload: z.union([
    z.object({
      succeeded: z.literal(true),
    }),
    z.object({ succeeded: z.literal(false), typeOfFail: z.string() }),
  ]),
});
export const getListFriendSendback = z.object({
  command: z.literal('getListFriendSendback'),
  payload: z.union([
    z.object({
      succeeded: z.literal(true),
      list: z.array(z.string()),
    }),
    z.object({ succeeded: z.literal(false), typeOfFail: z.string() }),
  ]),
});

export const friendMessageSendback = z.object({
  command: z.literal('friendMessageSendback'),
  payload: z.object({
    sender: z.string(), // selectfriend, verwacht historie,
    text: z.string(), //  frendmessage, lijst met 1 element
    date: z.string(),
  }),
});
// -------------------------------------------------------------------------------
// CHANNELS
// -------------------------------------------------------------------------------

export const joinChannelSendback = z.object({
  command: z.literal('joinChannelSendback'),
  payload: z.union([
    z.object({
      succeeded: z.literal(true),
    }),
    z.object({ succeeded: z.literal(false), typeOfFail: z.string() }),
  ]),
});

export const selectChannelSendback = z.object({
  command: z.literal('selectChannelSendback'),
  payload: z.union([
    z.object({
      succeeded: z.literal(true),
      messages: z.array(z.object({ sender: z.string(), text: z.string(), date: z.string() })),
    }),
    z.object({ succeeded: z.literal(false), typeOfFail: z.string() }),
  ]),
});

export const leaveChannelSendback = z.object({
  command: z.literal('leaveChannelSendback'),
  payload: z.union([
    z.object({
      succeeded: z.literal(true),
    }),
    z.object({
      succeeded: z.literal(false),
      typeOfFail: z.string(),
    }),
  ]),
});
export const channelMessageSendback = z.object({
  command: z.literal('channelMessageSendback'),
  payload: z.object({
    sender: z.string(), // selectfriend, verwacht historie,
    text: z.string(), //  frendmessage, lijst met 1 element
    date: z.string(),
  }),
});
export const getListChannelSendback = z.object({
  command: z.literal('getListChannelSendback'),
  payload: z.union([
    z.object({
      succeeded: z.literal(true),
      list: z.array(z.string()),
    }),
    z.object({ succeeded: z.literal(false), typeOfFail: z.string() }),
  ]),
});
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

// -------------------------------------------------------------------------------
// ALL TOGETHER
// -------------------------------------------------------------------------------

//FIXME: bijvoegen schemas in z.union
export const MessageSchema = z.union([
  registrationSendback,
  loginSendback,
  selectFriendSendback,
  removeFriendSendback,
  joinChannelSendback,
  selectChannelSendback,
  leaveChannelSendback,
  getListChannelSendback,
  getListFriendSendback,
  addFriendSendback,
  friendMessageSendback,
  channelMessageSendback,
  ErrorSchema,
]);
