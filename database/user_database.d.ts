import { z } from 'zod';
import { User } from '../objects/user/user.js';
declare const userJSONSchema: z.ZodObject<{
    UUID: z.ZodString;
    name: z.ZodString;
    password: z.ZodString;
    profilePicture: z.ZodString;
    publicChannels: z.ZodArray<z.ZodString, "many">;
    friendChannels: z.ZodArray<z.ZodString, "many">;
    friends: z.ZodArray<z.ZodString, "many">;
    ngrams: z.ZodArray<z.ZodTuple<[z.ZodString, z.ZodNumber], null>, "many">;
    verificationSucceeded: z.ZodBoolean;
}, "strip", z.ZodTypeAny, {
    password: string;
    profilePicture: string;
    name: string;
    UUID: string;
    publicChannels: string[];
    friendChannels: string[];
    friends: string[];
    ngrams: [string, number][];
    verificationSucceeded: boolean;
}, {
    password: string;
    profilePicture: string;
    name: string;
    UUID: string;
    publicChannels: string[];
    friendChannels: string[];
    friends: string[];
    ngrams: [string, number][];
    verificationSucceeded: boolean;
}>;
export declare type UserJSONSchema = z.infer<typeof userJSONSchema>;
/**
 * delete a user from database
 * @param user the user instance to be deleted from database
 */
export declare function userDelete(user: User): void;
/**
 * saves a user to database
 * @param user the user instance to be saved to the database
 */
export declare function userSave(user: User): Promise<void>;
/**
 * loads a user object from the database
 * @param identifier the unique identifier for a user object (UUID)
 * @returns
 */
export declare function userLoad(identifier: string): Promise<User | undefined>;
export {};
//# sourceMappingURL=user_database.d.ts.map