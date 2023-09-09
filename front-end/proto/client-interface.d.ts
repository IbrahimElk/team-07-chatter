import { z } from 'zod';
/**
 * All the interfaces that the client can send to the server.
 * Each interface contains a command, which identifies the type of the interface
 * and a payload, containing the information useful to the server.
 */
export declare const ErrorSchema: z.ZodObject<{
    command: z.ZodLiteral<"ERROR">;
    payload: z.ZodObject<{
        Status: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        Status: string;
    }, {
        Status: string;
    }>;
}, "strip", z.ZodTypeAny, {
    command: "ERROR";
    payload: {
        Status: string;
    };
}, {
    command: "ERROR";
    payload: {
        Status: string;
    };
}>;
export declare const login: z.ZodObject<{
    command: z.ZodLiteral<"login">;
    payload: z.ZodObject<{
        sessionID: z.ZodString;
        usernameUUID: z.ZodString;
        password: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        sessionID: string;
        usernameUUID: string;
        password: string;
    }, {
        sessionID: string;
        usernameUUID: string;
        password: string;
    }>;
}, "strip", z.ZodTypeAny, {
    command: "login";
    payload: {
        sessionID: string;
        usernameUUID: string;
        password: string;
    };
}, {
    command: "login";
    payload: {
        sessionID: string;
        usernameUUID: string;
        password: string;
    };
}>;
export declare const logout: z.ZodObject<{
    command: z.ZodLiteral<"logout">;
    payload: z.ZodObject<{
        sessionID: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        sessionID: string;
    }, {
        sessionID: string;
    }>;
}, "strip", z.ZodTypeAny, {
    command: "logout";
    payload: {
        sessionID: string;
    };
}, {
    command: "logout";
    payload: {
        sessionID: string;
    };
}>;
export declare const settings: z.ZodObject<{
    command: z.ZodLiteral<"settings">;
    payload: z.ZodObject<{
        sessionID: z.ZodString;
        newUsername: z.ZodString;
        profileLink: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        sessionID: string;
        newUsername: string;
        profileLink: string;
    }, {
        sessionID: string;
        newUsername: string;
        profileLink: string;
    }>;
}, "strip", z.ZodTypeAny, {
    command: "settings";
    payload: {
        sessionID: string;
        newUsername: string;
        profileLink: string;
    };
}, {
    command: "settings";
    payload: {
        sessionID: string;
        newUsername: string;
        profileLink: string;
    };
}>;
export declare const registration: z.ZodObject<{
    command: z.ZodLiteral<"registration">;
    payload: z.ZodObject<{
        sessionID: z.ZodString;
        usernameUUID: z.ZodString;
        password: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        sessionID: string;
        usernameUUID: string;
        password: string;
    }, {
        sessionID: string;
        usernameUUID: string;
        password: string;
    }>;
}, "strip", z.ZodTypeAny, {
    command: "registration";
    payload: {
        sessionID: string;
        usernameUUID: string;
        password: string;
    };
}, {
    command: "registration";
    payload: {
        sessionID: string;
        usernameUUID: string;
        password: string;
    };
}>;
export declare const validateSession: z.ZodObject<{
    command: z.ZodLiteral<"validateSession">;
    payload: z.ZodObject<{
        sessionID: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        sessionID: string;
    }, {
        sessionID: string;
    }>;
}, "strip", z.ZodTypeAny, {
    command: "validateSession";
    payload: {
        sessionID: string;
    };
}, {
    command: "validateSession";
    payload: {
        sessionID: string;
    };
}>;
export declare const requestTimetable: z.ZodObject<{
    command: z.ZodLiteral<"requestTimetable">;
    payload: z.ZodObject<{
        sessionID: z.ZodString;
        authenticationCode: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        sessionID: string;
        authenticationCode: string;
    }, {
        sessionID: string;
        authenticationCode: string;
    }>;
}, "strip", z.ZodTypeAny, {
    command: "requestTimetable";
    payload: {
        sessionID: string;
        authenticationCode: string;
    };
}, {
    command: "requestTimetable";
    payload: {
        sessionID: string;
        authenticationCode: string;
    };
}>;
export declare const getList: z.ZodObject<{
    command: z.ZodLiteral<"getList">;
    payload: z.ZodObject<{
        sessionID: z.ZodString;
        string: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        string: string;
        sessionID: string;
    }, {
        string: string;
        sessionID: string;
    }>;
}, "strip", z.ZodTypeAny, {
    command: "getList";
    payload: {
        string: string;
        sessionID: string;
    };
}, {
    command: "getList";
    payload: {
        string: string;
        sessionID: string;
    };
}>;
export declare const updateSettings: z.ZodObject<{
    command: z.ZodLiteral<"updateSettings">;
    payload: z.ZodObject<{
        sessionID: z.ZodString;
        profilePicture: z.ZodString;
        username: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        sessionID: string;
        profilePicture: string;
        username: string;
    }, {
        sessionID: string;
        profilePicture: string;
        username: string;
    }>;
}, "strip", z.ZodTypeAny, {
    command: "updateSettings";
    payload: {
        sessionID: string;
        profilePicture: string;
        username: string;
    };
}, {
    command: "updateSettings";
    payload: {
        sessionID: string;
        profilePicture: string;
        username: string;
    };
}>;
export declare const addFriend: z.ZodObject<{
    command: z.ZodLiteral<"addFriend">;
    payload: z.ZodObject<{
        sessionID: z.ZodString;
        friendUUID: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        sessionID: string;
        friendUUID: string;
    }, {
        sessionID: string;
        friendUUID: string;
    }>;
}, "strip", z.ZodTypeAny, {
    command: "addFriend";
    payload: {
        sessionID: string;
        friendUUID: string;
    };
}, {
    command: "addFriend";
    payload: {
        sessionID: string;
        friendUUID: string;
    };
}>;
export declare const selectFriend: z.ZodObject<{
    command: z.ZodLiteral<"SelectFriend">;
    payload: z.ZodObject<{
        sessionID: z.ZodString;
        friendUUID: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        sessionID: string;
        friendUUID: string;
    }, {
        sessionID: string;
        friendUUID: string;
    }>;
}, "strip", z.ZodTypeAny, {
    command: "SelectFriend";
    payload: {
        sessionID: string;
        friendUUID: string;
    };
}, {
    command: "SelectFriend";
    payload: {
        sessionID: string;
        friendUUID: string;
    };
}>;
export declare const removeFriend: z.ZodObject<{
    command: z.ZodLiteral<"removeFriend">;
    payload: z.ZodObject<{
        sessionID: z.ZodString;
        friendUUID: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        sessionID: string;
        friendUUID: string;
    }, {
        sessionID: string;
        friendUUID: string;
    }>;
}, "strip", z.ZodTypeAny, {
    command: "removeFriend";
    payload: {
        sessionID: string;
        friendUUID: string;
    };
}, {
    command: "removeFriend";
    payload: {
        sessionID: string;
        friendUUID: string;
    };
}>;
export declare const friendMessage: z.ZodObject<{
    command: z.ZodLiteral<"friendMessage">;
    payload: z.ZodObject<{
        sessionID: z.ZodString;
        channelID: z.ZodString;
        text: z.ZodString;
        date: z.ZodString;
        NgramDelta: z.ZodArray<z.ZodTuple<[z.ZodString, z.ZodNumber], null>, "many">;
    }, "strip", z.ZodTypeAny, {
        date: string;
        sessionID: string;
        channelID: string;
        text: string;
        NgramDelta: [string, number][];
    }, {
        date: string;
        sessionID: string;
        channelID: string;
        text: string;
        NgramDelta: [string, number][];
    }>;
}, "strip", z.ZodTypeAny, {
    command: "friendMessage";
    payload: {
        date: string;
        sessionID: string;
        channelID: string;
        text: string;
        NgramDelta: [string, number][];
    };
}, {
    command: "friendMessage";
    payload: {
        date: string;
        sessionID: string;
        channelID: string;
        text: string;
        NgramDelta: [string, number][];
    };
}>;
export declare const connectChannel: z.ZodObject<{
    command: z.ZodLiteral<"connectChannel">;
    payload: z.ZodObject<{
        sessionID: z.ZodString;
        channelCUID: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        sessionID: string;
        channelCUID: string;
    }, {
        sessionID: string;
        channelCUID: string;
    }>;
}, "strip", z.ZodTypeAny, {
    command: "connectChannel";
    payload: {
        sessionID: string;
        channelCUID: string;
    };
}, {
    command: "connectChannel";
    payload: {
        sessionID: string;
        channelCUID: string;
    };
}>;
export declare const disconnectChannel: z.ZodObject<{
    command: z.ZodLiteral<"disconnectChannel">;
    payload: z.ZodObject<{
        sessionID: z.ZodString;
        channelCUID: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        sessionID: string;
        channelCUID: string;
    }, {
        sessionID: string;
        channelCUID: string;
    }>;
}, "strip", z.ZodTypeAny, {
    command: "disconnectChannel";
    payload: {
        sessionID: string;
        channelCUID: string;
    };
}, {
    command: "disconnectChannel";
    payload: {
        sessionID: string;
        channelCUID: string;
    };
}>;
export declare const channelMessage: z.ZodObject<{
    command: z.ZodLiteral<"channelMessage">;
    payload: z.ZodObject<{
        sessionID: z.ZodString;
        channelCUID: z.ZodString;
        text: z.ZodString;
        date: z.ZodString;
        NgramDelta: z.ZodArray<z.ZodTuple<[z.ZodString, z.ZodNumber], null>, "many">;
    }, "strip", z.ZodTypeAny, {
        date: string;
        sessionID: string;
        text: string;
        NgramDelta: [string, number][];
        channelCUID: string;
    }, {
        date: string;
        sessionID: string;
        text: string;
        NgramDelta: [string, number][];
        channelCUID: string;
    }>;
}, "strip", z.ZodTypeAny, {
    command: "channelMessage";
    payload: {
        date: string;
        sessionID: string;
        text: string;
        NgramDelta: [string, number][];
        channelCUID: string;
    };
}, {
    command: "channelMessage";
    payload: {
        date: string;
        sessionID: string;
        text: string;
        NgramDelta: [string, number][];
        channelCUID: string;
    };
}>;
export declare const verification: z.ZodObject<{
    command: z.ZodLiteral<"verification">;
    payload: z.ZodObject<{
        sessionID: z.ZodString;
        NgramDelta: z.ZodArray<z.ZodTuple<[z.ZodString, z.ZodNumber], null>, "many">;
    }, "strip", z.ZodTypeAny, {
        sessionID: string;
        NgramDelta: [string, number][];
    }, {
        sessionID: string;
        NgramDelta: [string, number][];
    }>;
}, "strip", z.ZodTypeAny, {
    command: "verification";
    payload: {
        sessionID: string;
        NgramDelta: [string, number][];
    };
}, {
    command: "verification";
    payload: {
        sessionID: string;
        NgramDelta: [string, number][];
    };
}>;
export declare const MessageSchema: z.ZodUnion<[z.ZodObject<{
    command: z.ZodLiteral<"login">;
    payload: z.ZodObject<{
        sessionID: z.ZodString;
        usernameUUID: z.ZodString;
        password: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        sessionID: string;
        usernameUUID: string;
        password: string;
    }, {
        sessionID: string;
        usernameUUID: string;
        password: string;
    }>;
}, "strip", z.ZodTypeAny, {
    command: "login";
    payload: {
        sessionID: string;
        usernameUUID: string;
        password: string;
    };
}, {
    command: "login";
    payload: {
        sessionID: string;
        usernameUUID: string;
        password: string;
    };
}>, z.ZodObject<{
    command: z.ZodLiteral<"verification">;
    payload: z.ZodObject<{
        sessionID: z.ZodString;
        NgramDelta: z.ZodArray<z.ZodTuple<[z.ZodString, z.ZodNumber], null>, "many">;
    }, "strip", z.ZodTypeAny, {
        sessionID: string;
        NgramDelta: [string, number][];
    }, {
        sessionID: string;
        NgramDelta: [string, number][];
    }>;
}, "strip", z.ZodTypeAny, {
    command: "verification";
    payload: {
        sessionID: string;
        NgramDelta: [string, number][];
    };
}, {
    command: "verification";
    payload: {
        sessionID: string;
        NgramDelta: [string, number][];
    };
}>, z.ZodObject<{
    command: z.ZodLiteral<"logout">;
    payload: z.ZodObject<{
        sessionID: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        sessionID: string;
    }, {
        sessionID: string;
    }>;
}, "strip", z.ZodTypeAny, {
    command: "logout";
    payload: {
        sessionID: string;
    };
}, {
    command: "logout";
    payload: {
        sessionID: string;
    };
}>, z.ZodObject<{
    command: z.ZodLiteral<"registration">;
    payload: z.ZodObject<{
        sessionID: z.ZodString;
        usernameUUID: z.ZodString;
        password: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        sessionID: string;
        usernameUUID: string;
        password: string;
    }, {
        sessionID: string;
        usernameUUID: string;
        password: string;
    }>;
}, "strip", z.ZodTypeAny, {
    command: "registration";
    payload: {
        sessionID: string;
        usernameUUID: string;
        password: string;
    };
}, {
    command: "registration";
    payload: {
        sessionID: string;
        usernameUUID: string;
        password: string;
    };
}>, z.ZodObject<{
    command: z.ZodLiteral<"validateSession">;
    payload: z.ZodObject<{
        sessionID: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        sessionID: string;
    }, {
        sessionID: string;
    }>;
}, "strip", z.ZodTypeAny, {
    command: "validateSession";
    payload: {
        sessionID: string;
    };
}, {
    command: "validateSession";
    payload: {
        sessionID: string;
    };
}>, z.ZodObject<{
    command: z.ZodLiteral<"requestTimetable">;
    payload: z.ZodObject<{
        sessionID: z.ZodString;
        authenticationCode: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        sessionID: string;
        authenticationCode: string;
    }, {
        sessionID: string;
        authenticationCode: string;
    }>;
}, "strip", z.ZodTypeAny, {
    command: "requestTimetable";
    payload: {
        sessionID: string;
        authenticationCode: string;
    };
}, {
    command: "requestTimetable";
    payload: {
        sessionID: string;
        authenticationCode: string;
    };
}>, z.ZodObject<{
    command: z.ZodLiteral<"addFriend">;
    payload: z.ZodObject<{
        sessionID: z.ZodString;
        friendUUID: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        sessionID: string;
        friendUUID: string;
    }, {
        sessionID: string;
        friendUUID: string;
    }>;
}, "strip", z.ZodTypeAny, {
    command: "addFriend";
    payload: {
        sessionID: string;
        friendUUID: string;
    };
}, {
    command: "addFriend";
    payload: {
        sessionID: string;
        friendUUID: string;
    };
}>, z.ZodObject<{
    command: z.ZodLiteral<"SelectFriend">;
    payload: z.ZodObject<{
        sessionID: z.ZodString;
        friendUUID: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        sessionID: string;
        friendUUID: string;
    }, {
        sessionID: string;
        friendUUID: string;
    }>;
}, "strip", z.ZodTypeAny, {
    command: "SelectFriend";
    payload: {
        sessionID: string;
        friendUUID: string;
    };
}, {
    command: "SelectFriend";
    payload: {
        sessionID: string;
        friendUUID: string;
    };
}>, z.ZodObject<{
    command: z.ZodLiteral<"removeFriend">;
    payload: z.ZodObject<{
        sessionID: z.ZodString;
        friendUUID: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        sessionID: string;
        friendUUID: string;
    }, {
        sessionID: string;
        friendUUID: string;
    }>;
}, "strip", z.ZodTypeAny, {
    command: "removeFriend";
    payload: {
        sessionID: string;
        friendUUID: string;
    };
}, {
    command: "removeFriend";
    payload: {
        sessionID: string;
        friendUUID: string;
    };
}>, z.ZodObject<{
    command: z.ZodLiteral<"connectChannel">;
    payload: z.ZodObject<{
        sessionID: z.ZodString;
        channelCUID: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        sessionID: string;
        channelCUID: string;
    }, {
        sessionID: string;
        channelCUID: string;
    }>;
}, "strip", z.ZodTypeAny, {
    command: "connectChannel";
    payload: {
        sessionID: string;
        channelCUID: string;
    };
}, {
    command: "connectChannel";
    payload: {
        sessionID: string;
        channelCUID: string;
    };
}>, z.ZodObject<{
    command: z.ZodLiteral<"disconnectChannel">;
    payload: z.ZodObject<{
        sessionID: z.ZodString;
        channelCUID: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        sessionID: string;
        channelCUID: string;
    }, {
        sessionID: string;
        channelCUID: string;
    }>;
}, "strip", z.ZodTypeAny, {
    command: "disconnectChannel";
    payload: {
        sessionID: string;
        channelCUID: string;
    };
}, {
    command: "disconnectChannel";
    payload: {
        sessionID: string;
        channelCUID: string;
    };
}>, z.ZodObject<{
    command: z.ZodLiteral<"getList">;
    payload: z.ZodObject<{
        sessionID: z.ZodString;
        string: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        string: string;
        sessionID: string;
    }, {
        string: string;
        sessionID: string;
    }>;
}, "strip", z.ZodTypeAny, {
    command: "getList";
    payload: {
        string: string;
        sessionID: string;
    };
}, {
    command: "getList";
    payload: {
        string: string;
        sessionID: string;
    };
}>, z.ZodObject<{
    command: z.ZodLiteral<"friendMessage">;
    payload: z.ZodObject<{
        sessionID: z.ZodString;
        channelID: z.ZodString;
        text: z.ZodString;
        date: z.ZodString;
        NgramDelta: z.ZodArray<z.ZodTuple<[z.ZodString, z.ZodNumber], null>, "many">;
    }, "strip", z.ZodTypeAny, {
        date: string;
        sessionID: string;
        channelID: string;
        text: string;
        NgramDelta: [string, number][];
    }, {
        date: string;
        sessionID: string;
        channelID: string;
        text: string;
        NgramDelta: [string, number][];
    }>;
}, "strip", z.ZodTypeAny, {
    command: "friendMessage";
    payload: {
        date: string;
        sessionID: string;
        channelID: string;
        text: string;
        NgramDelta: [string, number][];
    };
}, {
    command: "friendMessage";
    payload: {
        date: string;
        sessionID: string;
        channelID: string;
        text: string;
        NgramDelta: [string, number][];
    };
}>, z.ZodObject<{
    command: z.ZodLiteral<"channelMessage">;
    payload: z.ZodObject<{
        sessionID: z.ZodString;
        channelCUID: z.ZodString;
        text: z.ZodString;
        date: z.ZodString;
        NgramDelta: z.ZodArray<z.ZodTuple<[z.ZodString, z.ZodNumber], null>, "many">;
    }, "strip", z.ZodTypeAny, {
        date: string;
        sessionID: string;
        text: string;
        NgramDelta: [string, number][];
        channelCUID: string;
    }, {
        date: string;
        sessionID: string;
        text: string;
        NgramDelta: [string, number][];
        channelCUID: string;
    }>;
}, "strip", z.ZodTypeAny, {
    command: "channelMessage";
    payload: {
        date: string;
        sessionID: string;
        text: string;
        NgramDelta: [string, number][];
        channelCUID: string;
    };
}, {
    command: "channelMessage";
    payload: {
        date: string;
        sessionID: string;
        text: string;
        NgramDelta: [string, number][];
        channelCUID: string;
    };
}>, z.ZodObject<{
    command: z.ZodLiteral<"ERROR">;
    payload: z.ZodObject<{
        Status: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        Status: string;
    }, {
        Status: string;
    }>;
}, "strip", z.ZodTypeAny, {
    command: "ERROR";
    payload: {
        Status: string;
    };
}, {
    command: "ERROR";
    payload: {
        Status: string;
    };
}>, z.ZodObject<{
    command: z.ZodLiteral<"settings">;
    payload: z.ZodObject<{
        sessionID: z.ZodString;
        newUsername: z.ZodString;
        profileLink: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        sessionID: string;
        newUsername: string;
        profileLink: string;
    }, {
        sessionID: string;
        newUsername: string;
        profileLink: string;
    }>;
}, "strip", z.ZodTypeAny, {
    command: "settings";
    payload: {
        sessionID: string;
        newUsername: string;
        profileLink: string;
    };
}, {
    command: "settings";
    payload: {
        sessionID: string;
        newUsername: string;
        profileLink: string;
    };
}>]>;
//# sourceMappingURL=client-interface.d.ts.map