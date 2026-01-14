import { Client, Account, Databases, Users, ID } from "node-appwrite";

export const APPWRITE_ENDPOINT = process.env.APPWRITE_ENDPOINT || "https://cloud.appwrite.io/v1";
export const APPWRITE_PROJECT = process.env.APPWRITE_PROJECT || "";
export const APPWRITE_API_KEY = process.env.APPWRITE_API_KEY || "";

export const APPWRITE_DB_ID = process.env.APPWRITE_DATABASE_ID || "";
export const APPWRITE_COLLECTION_ID = "todos";

export function createAdminClient() {
    const client = new Client();
    client.setEndpoint(APPWRITE_ENDPOINT)
        .setProject(APPWRITE_PROJECT)
        .setKey(APPWRITE_API_KEY);

    return {
        getClient: () => client,
        users: new Users(client),
        databases: new Databases(client),
        account: new Account(client),
    };
}

export function createSessionClient(sessionSecret?: string) {
    const client = new Client()
        .setEndpoint(APPWRITE_ENDPOINT)
        .setProject(APPWRITE_PROJECT)

    if (sessionSecret) {
        client.setSession(sessionSecret)
    }

    return {
        get account() { return new Account(client) },
        get databases() { return new Databases(client) },
    }
}

export async function createNewUser(email: string, pass: string, name?: string) {
    const { users } = createAdminClient();
    return await users.create(ID.unique(), email, undefined, pass, name);
}


export async function createSession(email: string, password: string) {
    const client = new Client()
        .setEndpoint(APPWRITE_ENDPOINT)
        .setProject(APPWRITE_PROJECT)

    const account = new Account(client);

    // if password is incorrect.
    const sessionVerification = await account.createEmailPasswordSession(email, password);

    // 2 if succesfull,  use Admin API to create a session token we can actually see/use
    const { users } = createAdminClient();
    const userSession = await users.createSession(sessionVerification.userId);

    return userSession;
}
