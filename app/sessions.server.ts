import { createCookieSessionStorage } from "react-router";

export const { getSession, commitSession, destroySession } =
    createCookieSessionStorage({
        cookie: {
            name: "__session",
            httpOnly: true,
            path: "/",
            sameSite: "lax",
            secrets: ["s3cret1"], // In production, this should be an env var
            secure: false, // Force false for localhost debugging
        },
    });