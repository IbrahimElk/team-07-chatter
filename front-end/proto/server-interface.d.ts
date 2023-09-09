import { z } from 'zod';
/**
 * All the interfaces that the server can send to the client.
 * Each interface contains a command, which identifies the type of the interface
 * and a payload, containing the information useful to the client.
 */
export declare const registrationSendback: z.ZodObject<{
    command: z.ZodLiteral<"registrationSendback">;
    payload: z.ZodUnion<[z.ZodObject<{
        succeeded: z.ZodLiteral<true>;
        user: z.ZodObject<{
            UUID: z.ZodString;
            name: z.ZodString;
            profilePicture: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            profilePicture: string;
            UUID: string;
            name: string;
        }, {
            profilePicture: string;
            UUID: string;
            name: string;
        }>;
        timetable: z.ZodArray<z.ZodObject<{
            description: z.ZodString;
            startTime: z.ZodNumber;
            endTime: z.ZodNumber;
            building: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            description: string;
            startTime: number;
            endTime: number;
            building: string;
        }, {
            description: string;
            startTime: number;
            endTime: number;
            building: string;
        }>, "many">;
    }, "strip", z.ZodTypeAny, {
        succeeded: true;
        user: {
            profilePicture: string;
            UUID: string;
            name: string;
        };
        timetable: {
            description: string;
            startTime: number;
            endTime: number;
            building: string;
        }[];
    }, {
        succeeded: true;
        user: {
            profilePicture: string;
            UUID: string;
            name: string;
        };
        timetable: {
            description: string;
            startTime: number;
            endTime: number;
            building: string;
        }[];
    }>, z.ZodObject<{
        succeeded: z.ZodLiteral<false>;
        typeOfFail: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        succeeded: false;
        typeOfFail: string;
    }, {
        succeeded: false;
        typeOfFail: string;
    }>]>;
}, "strip", z.ZodTypeAny, {
    command: "registrationSendback";
    payload: {
        succeeded: true;
        user: {
            profilePicture: string;
            UUID: string;
            name: string;
        };
        timetable: {
            description: string;
            startTime: number;
            endTime: number;
            building: string;
        }[];
    } | {
        succeeded: false;
        typeOfFail: string;
    };
}, {
    command: "registrationSendback";
    payload: {
        succeeded: true;
        user: {
            profilePicture: string;
            UUID: string;
            name: string;
        };
        timetable: {
            description: string;
            startTime: number;
            endTime: number;
            building: string;
        }[];
    } | {
        succeeded: false;
        typeOfFail: string;
    };
}>;
export declare const loginSendback: z.ZodObject<{
    command: z.ZodLiteral<"loginSendback">;
    payload: z.ZodUnion<[z.ZodObject<{
        succeeded: z.ZodLiteral<true>;
        user: z.ZodObject<{
            UUID: z.ZodString;
            name: z.ZodString;
            profilePicture: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            profilePicture: string;
            UUID: string;
            name: string;
        }, {
            profilePicture: string;
            UUID: string;
            name: string;
        }>;
        timetable: z.ZodArray<z.ZodObject<{
            description: z.ZodString;
            startTime: z.ZodNumber;
            endTime: z.ZodNumber;
            building: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            description: string;
            startTime: number;
            endTime: number;
            building: string;
        }, {
            description: string;
            startTime: number;
            endTime: number;
            building: string;
        }>, "many">;
    }, "strip", z.ZodTypeAny, {
        succeeded: true;
        user: {
            profilePicture: string;
            UUID: string;
            name: string;
        };
        timetable: {
            description: string;
            startTime: number;
            endTime: number;
            building: string;
        }[];
    }, {
        succeeded: true;
        user: {
            profilePicture: string;
            UUID: string;
            name: string;
        };
        timetable: {
            description: string;
            startTime: number;
            endTime: number;
            building: string;
        }[];
    }>, z.ZodObject<{
        succeeded: z.ZodLiteral<false>;
        typeOfFail: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        succeeded: false;
        typeOfFail: string;
    }, {
        succeeded: false;
        typeOfFail: string;
    }>]>;
}, "strip", z.ZodTypeAny, {
    command: "loginSendback";
    payload: {
        succeeded: true;
        user: {
            profilePicture: string;
            UUID: string;
            name: string;
        };
        timetable: {
            description: string;
            startTime: number;
            endTime: number;
            building: string;
        }[];
    } | {
        succeeded: false;
        typeOfFail: string;
    };
}, {
    command: "loginSendback";
    payload: {
        succeeded: true;
        user: {
            profilePicture: string;
            UUID: string;
            name: string;
        };
        timetable: {
            description: string;
            startTime: number;
            endTime: number;
            building: string;
        }[];
    } | {
        succeeded: false;
        typeOfFail: string;
    };
}>;
export declare const logoutSendback: z.ZodObject<{
    command: z.ZodLiteral<"logoutSendback">;
    payload: z.ZodUnion<[z.ZodObject<{
        succeeded: z.ZodLiteral<true>;
    }, "strip", z.ZodTypeAny, {
        succeeded: true;
    }, {
        succeeded: true;
    }>, z.ZodObject<{
        succeeded: z.ZodLiteral<false>;
        typeOfFail: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        succeeded: false;
        typeOfFail: string;
    }, {
        succeeded: false;
        typeOfFail: string;
    }>]>;
}, "strip", z.ZodTypeAny, {
    command: "logoutSendback";
    payload: {
        succeeded: true;
    } | {
        succeeded: false;
        typeOfFail: string;
    };
}, {
    command: "logoutSendback";
    payload: {
        succeeded: true;
    } | {
        succeeded: false;
        typeOfFail: string;
    };
}>;
export declare const SaveSettingsSendback: z.ZodObject<{
    command: z.ZodLiteral<"SaveSettingsSendback">;
    payload: z.ZodUnion<[z.ZodObject<{
        succeeded: z.ZodLiteral<true>;
        newUsername: z.ZodString;
        profileLink: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        newUsername: string;
        profileLink: string;
        succeeded: true;
    }, {
        newUsername: string;
        profileLink: string;
        succeeded: true;
    }>, z.ZodObject<{
        succeeded: z.ZodLiteral<false>;
        typeOfFail: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        succeeded: false;
        typeOfFail: string;
    }, {
        succeeded: false;
        typeOfFail: string;
    }>]>;
}, "strip", z.ZodTypeAny, {
    command: "SaveSettingsSendback";
    payload: {
        newUsername: string;
        profileLink: string;
        succeeded: true;
    } | {
        succeeded: false;
        typeOfFail: string;
    };
}, {
    command: "SaveSettingsSendback";
    payload: {
        newUsername: string;
        profileLink: string;
        succeeded: true;
    } | {
        succeeded: false;
        typeOfFail: string;
    };
}>;
export declare const validateSessionSendback: z.ZodObject<{
    command: z.ZodLiteral<"validateSessionSendback">;
    payload: z.ZodUnion<[z.ZodObject<{
        succeeded: z.ZodLiteral<true>;
    }, "strip", z.ZodTypeAny, {
        succeeded: true;
    }, {
        succeeded: true;
    }>, z.ZodObject<{
        succeeded: z.ZodLiteral<false>;
        typeOfFail: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        succeeded: false;
        typeOfFail: string;
    }, {
        succeeded: false;
        typeOfFail: string;
    }>]>;
}, "strip", z.ZodTypeAny, {
    command: "validateSessionSendback";
    payload: {
        succeeded: true;
    } | {
        succeeded: false;
        typeOfFail: string;
    };
}, {
    command: "validateSessionSendback";
    payload: {
        succeeded: true;
    } | {
        succeeded: false;
        typeOfFail: string;
    };
}>;
export declare const sessionIDSendback: z.ZodObject<{
    command: z.ZodLiteral<"sessionID">;
    payload: z.ZodObject<{
        value: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        value: string;
    }, {
        value: string;
    }>;
}, "strip", z.ZodTypeAny, {
    command: "sessionID";
    payload: {
        value: string;
    };
}, {
    command: "sessionID";
    payload: {
        value: string;
    };
}>;
export declare const verificationSendback: z.ZodObject<{
    command: z.ZodLiteral<"verificationSendback">;
    payload: z.ZodUnion<[z.ZodObject<{
        succeeded: z.ZodLiteral<true>;
    }, "strip", z.ZodTypeAny, {
        succeeded: true;
    }, {
        succeeded: true;
    }>, z.ZodObject<{
        succeeded: z.ZodLiteral<false>;
        typeOfFail: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        succeeded: false;
        typeOfFail: string;
    }, {
        succeeded: false;
        typeOfFail: string;
    }>]>;
}, "strip", z.ZodTypeAny, {
    command: "verificationSendback";
    payload: {
        succeeded: true;
    } | {
        succeeded: false;
        typeOfFail: string;
    };
}, {
    command: "verificationSendback";
    payload: {
        succeeded: true;
    } | {
        succeeded: false;
        typeOfFail: string;
    };
}>;
export declare const selectFriendSendback: z.ZodObject<{
    command: z.ZodLiteral<"selectFriendSendback">;
    payload: z.ZodUnion<[z.ZodObject<{
        succeeded: z.ZodLiteral<true>;
        user: z.ZodObject<{
            UUID: z.ZodString;
            name: z.ZodString;
            profilePicture: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            profilePicture: string;
            UUID: string;
            name: string;
        }, {
            profilePicture: string;
            UUID: string;
            name: string;
        }>;
        channelID: z.ZodString;
        messages: z.ZodArray<z.ZodObject<{
            sender: z.ZodString;
            text: z.ZodString;
            date: z.ZodString;
            trust: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            date: string;
            text: string;
            sender: string;
            trust: number;
        }, {
            date: string;
            text: string;
            sender: string;
            trust: number;
        }>, "many">;
    }, "strip", z.ZodTypeAny, {
        channelID: string;
        succeeded: true;
        user: {
            profilePicture: string;
            UUID: string;
            name: string;
        };
        messages: {
            date: string;
            text: string;
            sender: string;
            trust: number;
        }[];
    }, {
        channelID: string;
        succeeded: true;
        user: {
            profilePicture: string;
            UUID: string;
            name: string;
        };
        messages: {
            date: string;
            text: string;
            sender: string;
            trust: number;
        }[];
    }>, z.ZodObject<{
        succeeded: z.ZodLiteral<false>;
        typeOfFail: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        succeeded: false;
        typeOfFail: string;
    }, {
        succeeded: false;
        typeOfFail: string;
    }>]>;
}, "strip", z.ZodTypeAny, {
    command: "selectFriendSendback";
    payload: {
        channelID: string;
        succeeded: true;
        user: {
            profilePicture: string;
            UUID: string;
            name: string;
        };
        messages: {
            date: string;
            text: string;
            sender: string;
            trust: number;
        }[];
    } | {
        succeeded: false;
        typeOfFail: string;
    };
}, {
    command: "selectFriendSendback";
    payload: {
        channelID: string;
        succeeded: true;
        user: {
            profilePicture: string;
            UUID: string;
            name: string;
        };
        messages: {
            date: string;
            text: string;
            sender: string;
            trust: number;
        }[];
    } | {
        succeeded: false;
        typeOfFail: string;
    };
}>;
export declare const addFriendSendback: z.ZodObject<{
    command: z.ZodLiteral<"addFriendSendback">;
    payload: z.ZodUnion<[z.ZodObject<{
        succeeded: z.ZodLiteral<true>;
        friend: z.ZodObject<{
            UUID: z.ZodString;
            name: z.ZodString;
            profilePicture: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            profilePicture: string;
            UUID: string;
            name: string;
        }, {
            profilePicture: string;
            UUID: string;
            name: string;
        }>;
    }, "strip", z.ZodTypeAny, {
        succeeded: true;
        friend: {
            profilePicture: string;
            UUID: string;
            name: string;
        };
    }, {
        succeeded: true;
        friend: {
            profilePicture: string;
            UUID: string;
            name: string;
        };
    }>, z.ZodObject<{
        succeeded: z.ZodLiteral<false>;
        typeOfFail: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        succeeded: false;
        typeOfFail: string;
    }, {
        succeeded: false;
        typeOfFail: string;
    }>]>;
}, "strip", z.ZodTypeAny, {
    command: "addFriendSendback";
    payload: {
        succeeded: true;
        friend: {
            profilePicture: string;
            UUID: string;
            name: string;
        };
    } | {
        succeeded: false;
        typeOfFail: string;
    };
}, {
    command: "addFriendSendback";
    payload: {
        succeeded: true;
        friend: {
            profilePicture: string;
            UUID: string;
            name: string;
        };
    } | {
        succeeded: false;
        typeOfFail: string;
    };
}>;
export declare const removeFriendSendback: z.ZodObject<{
    command: z.ZodLiteral<"removeFriendSendback">;
    payload: z.ZodUnion<[z.ZodObject<{
        succeeded: z.ZodLiteral<true>;
    }, "strip", z.ZodTypeAny, {
        succeeded: true;
    }, {
        succeeded: true;
    }>, z.ZodObject<{
        succeeded: z.ZodLiteral<false>;
        typeOfFail: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        succeeded: false;
        typeOfFail: string;
    }, {
        succeeded: false;
        typeOfFail: string;
    }>]>;
}, "strip", z.ZodTypeAny, {
    command: "removeFriendSendback";
    payload: {
        succeeded: true;
    } | {
        succeeded: false;
        typeOfFail: string;
    };
}, {
    command: "removeFriendSendback";
    payload: {
        succeeded: true;
    } | {
        succeeded: false;
        typeOfFail: string;
    };
}>;
export declare const getListFriendSendback: z.ZodObject<{
    command: z.ZodLiteral<"getListFriendSendback">;
    payload: z.ZodUnion<[z.ZodObject<{
        succeeded: z.ZodLiteral<true>;
        friends: z.ZodArray<z.ZodObject<{
            UUID: z.ZodString;
            name: z.ZodString;
            profilePicture: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            profilePicture: string;
            UUID: string;
            name: string;
        }, {
            profilePicture: string;
            UUID: string;
            name: string;
        }>, "many">;
    }, "strip", z.ZodTypeAny, {
        succeeded: true;
        friends: {
            profilePicture: string;
            UUID: string;
            name: string;
        }[];
    }, {
        succeeded: true;
        friends: {
            profilePicture: string;
            UUID: string;
            name: string;
        }[];
    }>, z.ZodObject<{
        succeeded: z.ZodLiteral<false>;
        typeOfFail: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        succeeded: false;
        typeOfFail: string;
    }, {
        succeeded: false;
        typeOfFail: string;
    }>]>;
}, "strip", z.ZodTypeAny, {
    command: "getListFriendSendback";
    payload: {
        succeeded: true;
        friends: {
            profilePicture: string;
            UUID: string;
            name: string;
        }[];
    } | {
        succeeded: false;
        typeOfFail: string;
    };
}, {
    command: "getListFriendSendback";
    payload: {
        succeeded: true;
        friends: {
            profilePicture: string;
            UUID: string;
            name: string;
        }[];
    } | {
        succeeded: false;
        typeOfFail: string;
    };
}>;
export declare const messageSendbackFriend: z.ZodObject<{
    command: z.ZodLiteral<"messageSendbackFriend">;
    payload: z.ZodUnion<[z.ZodObject<{
        succeeded: z.ZodLiteral<true>;
        sender: z.ZodString;
        text: z.ZodString;
        date: z.ZodString;
        trustLevel: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        date: string;
        text: string;
        succeeded: true;
        sender: string;
        trustLevel: number;
    }, {
        date: string;
        text: string;
        succeeded: true;
        sender: string;
        trustLevel: number;
    }>, z.ZodObject<{
        succeeded: z.ZodLiteral<false>;
        typeOfFail: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        succeeded: false;
        typeOfFail: string;
    }, {
        succeeded: false;
        typeOfFail: string;
    }>]>;
}, "strip", z.ZodTypeAny, {
    command: "messageSendbackFriend";
    payload: {
        date: string;
        text: string;
        succeeded: true;
        sender: string;
        trustLevel: number;
    } | {
        succeeded: false;
        typeOfFail: string;
    };
}, {
    command: "messageSendbackFriend";
    payload: {
        date: string;
        text: string;
        succeeded: true;
        sender: string;
        trustLevel: number;
    } | {
        succeeded: false;
        typeOfFail: string;
    };
}>;
export declare const connectChannelSendback: z.ZodObject<{
    command: z.ZodLiteral<"connectChannelSendback">;
    payload: z.ZodUnion<[z.ZodObject<{
        succeeded: z.ZodLiteral<true>;
        user: z.ZodObject<{
            UUID: z.ZodString;
            name: z.ZodString;
            profilePicture: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            profilePicture: string;
            UUID: string;
            name: string;
        }, {
            profilePicture: string;
            UUID: string;
            name: string;
        }>;
    }, "strip", z.ZodTypeAny, {
        succeeded: true;
        user: {
            profilePicture: string;
            UUID: string;
            name: string;
        };
    }, {
        succeeded: true;
        user: {
            profilePicture: string;
            UUID: string;
            name: string;
        };
    }>, z.ZodObject<{
        succeeded: z.ZodLiteral<false>;
        typeOfFail: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        succeeded: false;
        typeOfFail: string;
    }, {
        succeeded: false;
        typeOfFail: string;
    }>]>;
}, "strip", z.ZodTypeAny, {
    command: "connectChannelSendback";
    payload: {
        succeeded: true;
        user: {
            profilePicture: string;
            UUID: string;
            name: string;
        };
    } | {
        succeeded: false;
        typeOfFail: string;
    };
}, {
    command: "connectChannelSendback";
    payload: {
        succeeded: true;
        user: {
            profilePicture: string;
            UUID: string;
            name: string;
        };
    } | {
        succeeded: false;
        typeOfFail: string;
    };
}>;
export declare const channelInfo: z.ZodObject<{
    command: z.ZodLiteral<"channelInfo">;
    payload: z.ZodObject<{
        connections: z.ZodArray<z.ZodObject<{
            UUID: z.ZodString;
            name: z.ZodString;
            profilePicture: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            profilePicture: string;
            UUID: string;
            name: string;
        }, {
            profilePicture: string;
            UUID: string;
            name: string;
        }>, "many">;
        messages: z.ZodArray<z.ZodObject<{
            user: z.ZodObject<{
                UUID: z.ZodString;
                name: z.ZodString;
                profilePicture: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                profilePicture: string;
                UUID: string;
                name: string;
            }, {
                profilePicture: string;
                UUID: string;
                name: string;
            }>;
            text: z.ZodString;
            date: z.ZodString;
            trust: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            date: string;
            text: string;
            user: {
                profilePicture: string;
                UUID: string;
                name: string;
            };
            trust: number;
        }, {
            date: string;
            text: string;
            user: {
                profilePicture: string;
                UUID: string;
                name: string;
            };
            trust: number;
        }>, "many">;
    }, "strip", z.ZodTypeAny, {
        messages: {
            date: string;
            text: string;
            user: {
                profilePicture: string;
                UUID: string;
                name: string;
            };
            trust: number;
        }[];
        connections: {
            profilePicture: string;
            UUID: string;
            name: string;
        }[];
    }, {
        messages: {
            date: string;
            text: string;
            user: {
                profilePicture: string;
                UUID: string;
                name: string;
            };
            trust: number;
        }[];
        connections: {
            profilePicture: string;
            UUID: string;
            name: string;
        }[];
    }>;
}, "strip", z.ZodTypeAny, {
    command: "channelInfo";
    payload: {
        messages: {
            date: string;
            text: string;
            user: {
                profilePicture: string;
                UUID: string;
                name: string;
            };
            trust: number;
        }[];
        connections: {
            profilePicture: string;
            UUID: string;
            name: string;
        }[];
    };
}, {
    command: "channelInfo";
    payload: {
        messages: {
            date: string;
            text: string;
            user: {
                profilePicture: string;
                UUID: string;
                name: string;
            };
            trust: number;
        }[];
        connections: {
            profilePicture: string;
            UUID: string;
            name: string;
        }[];
    };
}>;
export declare const messageSendbackChannel: z.ZodObject<{
    command: z.ZodLiteral<"messageSendbackChannel">;
    payload: z.ZodUnion<[z.ZodObject<{
        succeeded: z.ZodLiteral<true>;
        user: z.ZodObject<{
            UUID: z.ZodString;
            name: z.ZodString;
            profilePicture: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            profilePicture: string;
            UUID: string;
            name: string;
        }, {
            profilePicture: string;
            UUID: string;
            name: string;
        }>;
        text: z.ZodString;
        date: z.ZodString;
        trustLevel: z.ZodNumber;
        isNotification: z.ZodBoolean;
    }, "strip", z.ZodTypeAny, {
        date: string;
        text: string;
        succeeded: true;
        user: {
            profilePicture: string;
            UUID: string;
            name: string;
        };
        trustLevel: number;
        isNotification: boolean;
    }, {
        date: string;
        text: string;
        succeeded: true;
        user: {
            profilePicture: string;
            UUID: string;
            name: string;
        };
        trustLevel: number;
        isNotification: boolean;
    }>, z.ZodObject<{
        succeeded: z.ZodLiteral<false>;
        typeOfFail: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        succeeded: false;
        typeOfFail: string;
    }, {
        succeeded: false;
        typeOfFail: string;
    }>]>;
}, "strip", z.ZodTypeAny, {
    command: "messageSendbackChannel";
    payload: {
        date: string;
        text: string;
        succeeded: true;
        user: {
            profilePicture: string;
            UUID: string;
            name: string;
        };
        trustLevel: number;
        isNotification: boolean;
    } | {
        succeeded: false;
        typeOfFail: string;
    };
}, {
    command: "messageSendbackChannel";
    payload: {
        date: string;
        text: string;
        succeeded: true;
        user: {
            profilePicture: string;
            UUID: string;
            name: string;
        };
        trustLevel: number;
        isNotification: boolean;
    } | {
        succeeded: false;
        typeOfFail: string;
    };
}>;
export declare const disconnectChannelSendback: z.ZodObject<{
    command: z.ZodLiteral<"disconnectChannelSendback">;
    payload: z.ZodUnion<[z.ZodObject<{
        succeeded: z.ZodLiteral<true>;
        user: z.ZodObject<{
            UUID: z.ZodString;
            name: z.ZodString;
            profilePicture: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            profilePicture: string;
            UUID: string;
            name: string;
        }, {
            profilePicture: string;
            UUID: string;
            name: string;
        }>;
    }, "strip", z.ZodTypeAny, {
        succeeded: true;
        user: {
            profilePicture: string;
            UUID: string;
            name: string;
        };
    }, {
        succeeded: true;
        user: {
            profilePicture: string;
            UUID: string;
            name: string;
        };
    }>, z.ZodObject<{
        succeeded: z.ZodLiteral<false>;
        typeOfFail: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        succeeded: false;
        typeOfFail: string;
    }, {
        succeeded: false;
        typeOfFail: string;
    }>]>;
}, "strip", z.ZodTypeAny, {
    command: "disconnectChannelSendback";
    payload: {
        succeeded: true;
        user: {
            profilePicture: string;
            UUID: string;
            name: string;
        };
    } | {
        succeeded: false;
        typeOfFail: string;
    };
}, {
    command: "disconnectChannelSendback";
    payload: {
        succeeded: true;
        user: {
            profilePicture: string;
            UUID: string;
            name: string;
        };
    } | {
        succeeded: false;
        typeOfFail: string;
    };
}>;
export declare const requestTimetableSendback: z.ZodObject<{
    command: z.ZodLiteral<"requestTimetableSendback">;
    payload: z.ZodUnion<[z.ZodObject<{
        succeeded: z.ZodLiteral<true>;
        timetable: z.ZodArray<z.ZodObject<{
            description: z.ZodString;
            startTime: z.ZodNumber;
            endTime: z.ZodNumber;
            building: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            description: string;
            startTime: number;
            endTime: number;
            building: string;
        }, {
            description: string;
            startTime: number;
            endTime: number;
            building: string;
        }>, "many">;
    }, "strip", z.ZodTypeAny, {
        succeeded: true;
        timetable: {
            description: string;
            startTime: number;
            endTime: number;
            building: string;
        }[];
    }, {
        succeeded: true;
        timetable: {
            description: string;
            startTime: number;
            endTime: number;
            building: string;
        }[];
    }>, z.ZodObject<{
        succeeded: z.ZodLiteral<false>;
        typeOfFail: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        succeeded: false;
        typeOfFail: string;
    }, {
        succeeded: false;
        typeOfFail: string;
    }>]>;
}, "strip", z.ZodTypeAny, {
    command: "requestTimetableSendback";
    payload: {
        succeeded: true;
        timetable: {
            description: string;
            startTime: number;
            endTime: number;
            building: string;
        }[];
    } | {
        succeeded: false;
        typeOfFail: string;
    };
}, {
    command: "requestTimetableSendback";
    payload: {
        succeeded: true;
        timetable: {
            description: string;
            startTime: number;
            endTime: number;
            building: string;
        }[];
    } | {
        succeeded: false;
        typeOfFail: string;
    };
}>;
export declare const MessageSchema: z.ZodUnion<[z.ZodObject<{
    command: z.ZodLiteral<"registrationSendback">;
    payload: z.ZodUnion<[z.ZodObject<{
        succeeded: z.ZodLiteral<true>;
        user: z.ZodObject<{
            UUID: z.ZodString;
            name: z.ZodString;
            profilePicture: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            profilePicture: string;
            UUID: string;
            name: string;
        }, {
            profilePicture: string;
            UUID: string;
            name: string;
        }>;
        timetable: z.ZodArray<z.ZodObject<{
            description: z.ZodString;
            startTime: z.ZodNumber;
            endTime: z.ZodNumber;
            building: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            description: string;
            startTime: number;
            endTime: number;
            building: string;
        }, {
            description: string;
            startTime: number;
            endTime: number;
            building: string;
        }>, "many">;
    }, "strip", z.ZodTypeAny, {
        succeeded: true;
        user: {
            profilePicture: string;
            UUID: string;
            name: string;
        };
        timetable: {
            description: string;
            startTime: number;
            endTime: number;
            building: string;
        }[];
    }, {
        succeeded: true;
        user: {
            profilePicture: string;
            UUID: string;
            name: string;
        };
        timetable: {
            description: string;
            startTime: number;
            endTime: number;
            building: string;
        }[];
    }>, z.ZodObject<{
        succeeded: z.ZodLiteral<false>;
        typeOfFail: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        succeeded: false;
        typeOfFail: string;
    }, {
        succeeded: false;
        typeOfFail: string;
    }>]>;
}, "strip", z.ZodTypeAny, {
    command: "registrationSendback";
    payload: {
        succeeded: true;
        user: {
            profilePicture: string;
            UUID: string;
            name: string;
        };
        timetable: {
            description: string;
            startTime: number;
            endTime: number;
            building: string;
        }[];
    } | {
        succeeded: false;
        typeOfFail: string;
    };
}, {
    command: "registrationSendback";
    payload: {
        succeeded: true;
        user: {
            profilePicture: string;
            UUID: string;
            name: string;
        };
        timetable: {
            description: string;
            startTime: number;
            endTime: number;
            building: string;
        }[];
    } | {
        succeeded: false;
        typeOfFail: string;
    };
}>, z.ZodObject<{
    command: z.ZodLiteral<"loginSendback">;
    payload: z.ZodUnion<[z.ZodObject<{
        succeeded: z.ZodLiteral<true>;
        user: z.ZodObject<{
            UUID: z.ZodString;
            name: z.ZodString;
            profilePicture: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            profilePicture: string;
            UUID: string;
            name: string;
        }, {
            profilePicture: string;
            UUID: string;
            name: string;
        }>;
        timetable: z.ZodArray<z.ZodObject<{
            description: z.ZodString;
            startTime: z.ZodNumber;
            endTime: z.ZodNumber;
            building: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            description: string;
            startTime: number;
            endTime: number;
            building: string;
        }, {
            description: string;
            startTime: number;
            endTime: number;
            building: string;
        }>, "many">;
    }, "strip", z.ZodTypeAny, {
        succeeded: true;
        user: {
            profilePicture: string;
            UUID: string;
            name: string;
        };
        timetable: {
            description: string;
            startTime: number;
            endTime: number;
            building: string;
        }[];
    }, {
        succeeded: true;
        user: {
            profilePicture: string;
            UUID: string;
            name: string;
        };
        timetable: {
            description: string;
            startTime: number;
            endTime: number;
            building: string;
        }[];
    }>, z.ZodObject<{
        succeeded: z.ZodLiteral<false>;
        typeOfFail: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        succeeded: false;
        typeOfFail: string;
    }, {
        succeeded: false;
        typeOfFail: string;
    }>]>;
}, "strip", z.ZodTypeAny, {
    command: "loginSendback";
    payload: {
        succeeded: true;
        user: {
            profilePicture: string;
            UUID: string;
            name: string;
        };
        timetable: {
            description: string;
            startTime: number;
            endTime: number;
            building: string;
        }[];
    } | {
        succeeded: false;
        typeOfFail: string;
    };
}, {
    command: "loginSendback";
    payload: {
        succeeded: true;
        user: {
            profilePicture: string;
            UUID: string;
            name: string;
        };
        timetable: {
            description: string;
            startTime: number;
            endTime: number;
            building: string;
        }[];
    } | {
        succeeded: false;
        typeOfFail: string;
    };
}>, z.ZodObject<{
    command: z.ZodLiteral<"logoutSendback">;
    payload: z.ZodUnion<[z.ZodObject<{
        succeeded: z.ZodLiteral<true>;
    }, "strip", z.ZodTypeAny, {
        succeeded: true;
    }, {
        succeeded: true;
    }>, z.ZodObject<{
        succeeded: z.ZodLiteral<false>;
        typeOfFail: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        succeeded: false;
        typeOfFail: string;
    }, {
        succeeded: false;
        typeOfFail: string;
    }>]>;
}, "strip", z.ZodTypeAny, {
    command: "logoutSendback";
    payload: {
        succeeded: true;
    } | {
        succeeded: false;
        typeOfFail: string;
    };
}, {
    command: "logoutSendback";
    payload: {
        succeeded: true;
    } | {
        succeeded: false;
        typeOfFail: string;
    };
}>, z.ZodObject<{
    command: z.ZodLiteral<"validateSessionSendback">;
    payload: z.ZodUnion<[z.ZodObject<{
        succeeded: z.ZodLiteral<true>;
    }, "strip", z.ZodTypeAny, {
        succeeded: true;
    }, {
        succeeded: true;
    }>, z.ZodObject<{
        succeeded: z.ZodLiteral<false>;
        typeOfFail: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        succeeded: false;
        typeOfFail: string;
    }, {
        succeeded: false;
        typeOfFail: string;
    }>]>;
}, "strip", z.ZodTypeAny, {
    command: "validateSessionSendback";
    payload: {
        succeeded: true;
    } | {
        succeeded: false;
        typeOfFail: string;
    };
}, {
    command: "validateSessionSendback";
    payload: {
        succeeded: true;
    } | {
        succeeded: false;
        typeOfFail: string;
    };
}>, z.ZodObject<{
    command: z.ZodLiteral<"channelInfo">;
    payload: z.ZodObject<{
        connections: z.ZodArray<z.ZodObject<{
            UUID: z.ZodString;
            name: z.ZodString;
            profilePicture: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            profilePicture: string;
            UUID: string;
            name: string;
        }, {
            profilePicture: string;
            UUID: string;
            name: string;
        }>, "many">;
        messages: z.ZodArray<z.ZodObject<{
            user: z.ZodObject<{
                UUID: z.ZodString;
                name: z.ZodString;
                profilePicture: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                profilePicture: string;
                UUID: string;
                name: string;
            }, {
                profilePicture: string;
                UUID: string;
                name: string;
            }>;
            text: z.ZodString;
            date: z.ZodString;
            trust: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            date: string;
            text: string;
            user: {
                profilePicture: string;
                UUID: string;
                name: string;
            };
            trust: number;
        }, {
            date: string;
            text: string;
            user: {
                profilePicture: string;
                UUID: string;
                name: string;
            };
            trust: number;
        }>, "many">;
    }, "strip", z.ZodTypeAny, {
        messages: {
            date: string;
            text: string;
            user: {
                profilePicture: string;
                UUID: string;
                name: string;
            };
            trust: number;
        }[];
        connections: {
            profilePicture: string;
            UUID: string;
            name: string;
        }[];
    }, {
        messages: {
            date: string;
            text: string;
            user: {
                profilePicture: string;
                UUID: string;
                name: string;
            };
            trust: number;
        }[];
        connections: {
            profilePicture: string;
            UUID: string;
            name: string;
        }[];
    }>;
}, "strip", z.ZodTypeAny, {
    command: "channelInfo";
    payload: {
        messages: {
            date: string;
            text: string;
            user: {
                profilePicture: string;
                UUID: string;
                name: string;
            };
            trust: number;
        }[];
        connections: {
            profilePicture: string;
            UUID: string;
            name: string;
        }[];
    };
}, {
    command: "channelInfo";
    payload: {
        messages: {
            date: string;
            text: string;
            user: {
                profilePicture: string;
                UUID: string;
                name: string;
            };
            trust: number;
        }[];
        connections: {
            profilePicture: string;
            UUID: string;
            name: string;
        }[];
    };
}>, z.ZodObject<{
    command: z.ZodLiteral<"verificationSendback">;
    payload: z.ZodUnion<[z.ZodObject<{
        succeeded: z.ZodLiteral<true>;
    }, "strip", z.ZodTypeAny, {
        succeeded: true;
    }, {
        succeeded: true;
    }>, z.ZodObject<{
        succeeded: z.ZodLiteral<false>;
        typeOfFail: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        succeeded: false;
        typeOfFail: string;
    }, {
        succeeded: false;
        typeOfFail: string;
    }>]>;
}, "strip", z.ZodTypeAny, {
    command: "verificationSendback";
    payload: {
        succeeded: true;
    } | {
        succeeded: false;
        typeOfFail: string;
    };
}, {
    command: "verificationSendback";
    payload: {
        succeeded: true;
    } | {
        succeeded: false;
        typeOfFail: string;
    };
}>, z.ZodObject<{
    command: z.ZodLiteral<"requestTimetableSendback">;
    payload: z.ZodUnion<[z.ZodObject<{
        succeeded: z.ZodLiteral<true>;
        timetable: z.ZodArray<z.ZodObject<{
            description: z.ZodString;
            startTime: z.ZodNumber;
            endTime: z.ZodNumber;
            building: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            description: string;
            startTime: number;
            endTime: number;
            building: string;
        }, {
            description: string;
            startTime: number;
            endTime: number;
            building: string;
        }>, "many">;
    }, "strip", z.ZodTypeAny, {
        succeeded: true;
        timetable: {
            description: string;
            startTime: number;
            endTime: number;
            building: string;
        }[];
    }, {
        succeeded: true;
        timetable: {
            description: string;
            startTime: number;
            endTime: number;
            building: string;
        }[];
    }>, z.ZodObject<{
        succeeded: z.ZodLiteral<false>;
        typeOfFail: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        succeeded: false;
        typeOfFail: string;
    }, {
        succeeded: false;
        typeOfFail: string;
    }>]>;
}, "strip", z.ZodTypeAny, {
    command: "requestTimetableSendback";
    payload: {
        succeeded: true;
        timetable: {
            description: string;
            startTime: number;
            endTime: number;
            building: string;
        }[];
    } | {
        succeeded: false;
        typeOfFail: string;
    };
}, {
    command: "requestTimetableSendback";
    payload: {
        succeeded: true;
        timetable: {
            description: string;
            startTime: number;
            endTime: number;
            building: string;
        }[];
    } | {
        succeeded: false;
        typeOfFail: string;
    };
}>, z.ZodObject<{
    command: z.ZodLiteral<"removeFriendSendback">;
    payload: z.ZodUnion<[z.ZodObject<{
        succeeded: z.ZodLiteral<true>;
    }, "strip", z.ZodTypeAny, {
        succeeded: true;
    }, {
        succeeded: true;
    }>, z.ZodObject<{
        succeeded: z.ZodLiteral<false>;
        typeOfFail: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        succeeded: false;
        typeOfFail: string;
    }, {
        succeeded: false;
        typeOfFail: string;
    }>]>;
}, "strip", z.ZodTypeAny, {
    command: "removeFriendSendback";
    payload: {
        succeeded: true;
    } | {
        succeeded: false;
        typeOfFail: string;
    };
}, {
    command: "removeFriendSendback";
    payload: {
        succeeded: true;
    } | {
        succeeded: false;
        typeOfFail: string;
    };
}>, z.ZodObject<{
    command: z.ZodLiteral<"connectChannelSendback">;
    payload: z.ZodUnion<[z.ZodObject<{
        succeeded: z.ZodLiteral<true>;
        user: z.ZodObject<{
            UUID: z.ZodString;
            name: z.ZodString;
            profilePicture: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            profilePicture: string;
            UUID: string;
            name: string;
        }, {
            profilePicture: string;
            UUID: string;
            name: string;
        }>;
    }, "strip", z.ZodTypeAny, {
        succeeded: true;
        user: {
            profilePicture: string;
            UUID: string;
            name: string;
        };
    }, {
        succeeded: true;
        user: {
            profilePicture: string;
            UUID: string;
            name: string;
        };
    }>, z.ZodObject<{
        succeeded: z.ZodLiteral<false>;
        typeOfFail: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        succeeded: false;
        typeOfFail: string;
    }, {
        succeeded: false;
        typeOfFail: string;
    }>]>;
}, "strip", z.ZodTypeAny, {
    command: "connectChannelSendback";
    payload: {
        succeeded: true;
        user: {
            profilePicture: string;
            UUID: string;
            name: string;
        };
    } | {
        succeeded: false;
        typeOfFail: string;
    };
}, {
    command: "connectChannelSendback";
    payload: {
        succeeded: true;
        user: {
            profilePicture: string;
            UUID: string;
            name: string;
        };
    } | {
        succeeded: false;
        typeOfFail: string;
    };
}>, z.ZodObject<{
    command: z.ZodLiteral<"disconnectChannelSendback">;
    payload: z.ZodUnion<[z.ZodObject<{
        succeeded: z.ZodLiteral<true>;
        user: z.ZodObject<{
            UUID: z.ZodString;
            name: z.ZodString;
            profilePicture: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            profilePicture: string;
            UUID: string;
            name: string;
        }, {
            profilePicture: string;
            UUID: string;
            name: string;
        }>;
    }, "strip", z.ZodTypeAny, {
        succeeded: true;
        user: {
            profilePicture: string;
            UUID: string;
            name: string;
        };
    }, {
        succeeded: true;
        user: {
            profilePicture: string;
            UUID: string;
            name: string;
        };
    }>, z.ZodObject<{
        succeeded: z.ZodLiteral<false>;
        typeOfFail: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        succeeded: false;
        typeOfFail: string;
    }, {
        succeeded: false;
        typeOfFail: string;
    }>]>;
}, "strip", z.ZodTypeAny, {
    command: "disconnectChannelSendback";
    payload: {
        succeeded: true;
        user: {
            profilePicture: string;
            UUID: string;
            name: string;
        };
    } | {
        succeeded: false;
        typeOfFail: string;
    };
}, {
    command: "disconnectChannelSendback";
    payload: {
        succeeded: true;
        user: {
            profilePicture: string;
            UUID: string;
            name: string;
        };
    } | {
        succeeded: false;
        typeOfFail: string;
    };
}>, z.ZodObject<{
    command: z.ZodLiteral<"getListFriendSendback">;
    payload: z.ZodUnion<[z.ZodObject<{
        succeeded: z.ZodLiteral<true>;
        friends: z.ZodArray<z.ZodObject<{
            UUID: z.ZodString;
            name: z.ZodString;
            profilePicture: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            profilePicture: string;
            UUID: string;
            name: string;
        }, {
            profilePicture: string;
            UUID: string;
            name: string;
        }>, "many">;
    }, "strip", z.ZodTypeAny, {
        succeeded: true;
        friends: {
            profilePicture: string;
            UUID: string;
            name: string;
        }[];
    }, {
        succeeded: true;
        friends: {
            profilePicture: string;
            UUID: string;
            name: string;
        }[];
    }>, z.ZodObject<{
        succeeded: z.ZodLiteral<false>;
        typeOfFail: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        succeeded: false;
        typeOfFail: string;
    }, {
        succeeded: false;
        typeOfFail: string;
    }>]>;
}, "strip", z.ZodTypeAny, {
    command: "getListFriendSendback";
    payload: {
        succeeded: true;
        friends: {
            profilePicture: string;
            UUID: string;
            name: string;
        }[];
    } | {
        succeeded: false;
        typeOfFail: string;
    };
}, {
    command: "getListFriendSendback";
    payload: {
        succeeded: true;
        friends: {
            profilePicture: string;
            UUID: string;
            name: string;
        }[];
    } | {
        succeeded: false;
        typeOfFail: string;
    };
}>, z.ZodObject<{
    command: z.ZodLiteral<"addFriendSendback">;
    payload: z.ZodUnion<[z.ZodObject<{
        succeeded: z.ZodLiteral<true>;
        friend: z.ZodObject<{
            UUID: z.ZodString;
            name: z.ZodString;
            profilePicture: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            profilePicture: string;
            UUID: string;
            name: string;
        }, {
            profilePicture: string;
            UUID: string;
            name: string;
        }>;
    }, "strip", z.ZodTypeAny, {
        succeeded: true;
        friend: {
            profilePicture: string;
            UUID: string;
            name: string;
        };
    }, {
        succeeded: true;
        friend: {
            profilePicture: string;
            UUID: string;
            name: string;
        };
    }>, z.ZodObject<{
        succeeded: z.ZodLiteral<false>;
        typeOfFail: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        succeeded: false;
        typeOfFail: string;
    }, {
        succeeded: false;
        typeOfFail: string;
    }>]>;
}, "strip", z.ZodTypeAny, {
    command: "addFriendSendback";
    payload: {
        succeeded: true;
        friend: {
            profilePicture: string;
            UUID: string;
            name: string;
        };
    } | {
        succeeded: false;
        typeOfFail: string;
    };
}, {
    command: "addFriendSendback";
    payload: {
        succeeded: true;
        friend: {
            profilePicture: string;
            UUID: string;
            name: string;
        };
    } | {
        succeeded: false;
        typeOfFail: string;
    };
}>, z.ZodObject<{
    command: z.ZodLiteral<"messageSendbackChannel">;
    payload: z.ZodUnion<[z.ZodObject<{
        succeeded: z.ZodLiteral<true>;
        user: z.ZodObject<{
            UUID: z.ZodString;
            name: z.ZodString;
            profilePicture: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            profilePicture: string;
            UUID: string;
            name: string;
        }, {
            profilePicture: string;
            UUID: string;
            name: string;
        }>;
        text: z.ZodString;
        date: z.ZodString;
        trustLevel: z.ZodNumber;
        isNotification: z.ZodBoolean;
    }, "strip", z.ZodTypeAny, {
        date: string;
        text: string;
        succeeded: true;
        user: {
            profilePicture: string;
            UUID: string;
            name: string;
        };
        trustLevel: number;
        isNotification: boolean;
    }, {
        date: string;
        text: string;
        succeeded: true;
        user: {
            profilePicture: string;
            UUID: string;
            name: string;
        };
        trustLevel: number;
        isNotification: boolean;
    }>, z.ZodObject<{
        succeeded: z.ZodLiteral<false>;
        typeOfFail: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        succeeded: false;
        typeOfFail: string;
    }, {
        succeeded: false;
        typeOfFail: string;
    }>]>;
}, "strip", z.ZodTypeAny, {
    command: "messageSendbackChannel";
    payload: {
        date: string;
        text: string;
        succeeded: true;
        user: {
            profilePicture: string;
            UUID: string;
            name: string;
        };
        trustLevel: number;
        isNotification: boolean;
    } | {
        succeeded: false;
        typeOfFail: string;
    };
}, {
    command: "messageSendbackChannel";
    payload: {
        date: string;
        text: string;
        succeeded: true;
        user: {
            profilePicture: string;
            UUID: string;
            name: string;
        };
        trustLevel: number;
        isNotification: boolean;
    } | {
        succeeded: false;
        typeOfFail: string;
    };
}>, z.ZodObject<{
    command: z.ZodLiteral<"messageSendbackFriend">;
    payload: z.ZodUnion<[z.ZodObject<{
        succeeded: z.ZodLiteral<true>;
        sender: z.ZodString;
        text: z.ZodString;
        date: z.ZodString;
        trustLevel: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        date: string;
        text: string;
        succeeded: true;
        sender: string;
        trustLevel: number;
    }, {
        date: string;
        text: string;
        succeeded: true;
        sender: string;
        trustLevel: number;
    }>, z.ZodObject<{
        succeeded: z.ZodLiteral<false>;
        typeOfFail: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        succeeded: false;
        typeOfFail: string;
    }, {
        succeeded: false;
        typeOfFail: string;
    }>]>;
}, "strip", z.ZodTypeAny, {
    command: "messageSendbackFriend";
    payload: {
        date: string;
        text: string;
        succeeded: true;
        sender: string;
        trustLevel: number;
    } | {
        succeeded: false;
        typeOfFail: string;
    };
}, {
    command: "messageSendbackFriend";
    payload: {
        date: string;
        text: string;
        succeeded: true;
        sender: string;
        trustLevel: number;
    } | {
        succeeded: false;
        typeOfFail: string;
    };
}>, z.ZodObject<{
    command: z.ZodLiteral<"sessionID">;
    payload: z.ZodObject<{
        value: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        value: string;
    }, {
        value: string;
    }>;
}, "strip", z.ZodTypeAny, {
    command: "sessionID";
    payload: {
        value: string;
    };
}, {
    command: "sessionID";
    payload: {
        value: string;
    };
}>, z.ZodObject<{
    command: z.ZodLiteral<"SaveSettingsSendback">;
    payload: z.ZodUnion<[z.ZodObject<{
        succeeded: z.ZodLiteral<true>;
        newUsername: z.ZodString;
        profileLink: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        newUsername: string;
        profileLink: string;
        succeeded: true;
    }, {
        newUsername: string;
        profileLink: string;
        succeeded: true;
    }>, z.ZodObject<{
        succeeded: z.ZodLiteral<false>;
        typeOfFail: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        succeeded: false;
        typeOfFail: string;
    }, {
        succeeded: false;
        typeOfFail: string;
    }>]>;
}, "strip", z.ZodTypeAny, {
    command: "SaveSettingsSendback";
    payload: {
        newUsername: string;
        profileLink: string;
        succeeded: true;
    } | {
        succeeded: false;
        typeOfFail: string;
    };
}, {
    command: "SaveSettingsSendback";
    payload: {
        newUsername: string;
        profileLink: string;
        succeeded: true;
    } | {
        succeeded: false;
        typeOfFail: string;
    };
}>]>;
//# sourceMappingURL=server-interface.d.ts.map