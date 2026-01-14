// scripts/init-appwrite.js
import { Client, Databases, Permission, Role } from "node-appwrite";

import fs from 'node:fs';
import path from 'node:path';

// Load .env manually if not running with a loader
try {
    const envPath = path.resolve(process.cwd(), '.env');
    if (fs.existsSync(envPath)) {
        const envContent = fs.readFileSync(envPath, 'utf-8');
        envContent.split('\n').forEach(line => {
            const parts = line.split('=');
            if (parts.length >= 2) {
                const key = parts[0].trim();
                const value = parts.slice(1).join('=').trim();
                if (key && !process.env[key]) {
                    process.env[key] = value;
                }
            }
        });
    }
} catch (e) { }

const PROJECT_ID = process.env.APPWRITE_PROJECT;
const API_KEY = process.env.APPWRITE_API_KEY;

const ENDPOINT = process.env.APPWRITE_ENDPOINT || "https://cloud.appwrite.io/v1";

if (!PROJECT_ID || !API_KEY) {
    console.error("Please set APPWRITE_PROJECT and APPWRITE_API_KEY env vars.");
    process.exit(1);
}

const client = new Client()
    .setEndpoint(ENDPOINT)
    .setProject(PROJECT_ID)
    .setKey(API_KEY);

const databases = new Databases(client);

const DB_ID = "todo-db";
const COLL_ID = "todos";

async function main() {
    try {
        console.log("Checking Database...");
        try {
            await databases.get(DB_ID);
            console.log("Database exists.");
        } catch {
            console.log("Creating Database...");
            await databases.create(DB_ID, "Todo DB");
        }

        console.log("Checking Collection...");
        try {
            await databases.getCollection(DB_ID, COLL_ID);
            console.log("Collection exists.");
        } catch {
            console.log("Creating Collection...");
            await databases.createCollection(DB_ID, COLL_ID, "Todos", [
                Permission.read(Role.users()),
                Permission.write(Role.users()),
            ]);
        }


        const attributes = [
            { key: "content", type: "string", size: 255, required: true },
            { key: "isCompleted", type: "boolean", required: false, default: false },
            { key: "parentId", type: "string", size: 255, required: false },
            { key: "userId", type: "string", size: 255, required: true },
            { key: "createdAt", type: "datetime", required: false }, // optional
        ];

        //Doing this sequentially to avoid race conditions 

        for (const attr of attributes) {
            try {
                if (attr.type === 'string') {
                    await databases.createStringAttribute(DB_ID, COLL_ID, attr.key, attr.size, attr.required);
                } else if (attr.type === 'boolean') {
                    await databases.createBooleanAttribute(DB_ID, COLL_ID, attr.key, attr.required, attr.default);
                } else if (attr.type === 'datetime') {
                    await databases.createDatetimeAttribute(DB_ID, COLL_ID, attr.key, attr.required);
                }
                console.log(`Attribute ${attr.key} processed.`);
            } catch (error) {
                console.log(error);
            }
        }

        // Indexes
        try {
            await databases.createIndex(DB_ID, COLL_ID, "idx_user", "key", ["userId"]);
        } catch { }

        console.log("Done!");

    } catch (e) {
        console.error("Error:", e);
    }
}

main();
