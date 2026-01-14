import type { Route } from "./+types/login";
import { Form, redirect, useActionData } from "react-router";
import { createSession } from "../lib/appwrite.server";
import { commitSession, getSession } from "../sessions.server";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Login - Todo App" }];
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Email and Password are required." };
  }

  try {
    // Authenticate with helper
    const session = await createSession(email, password);
    

    // Store session secret
    const cookieSession = await getSession(request.headers.get("Cookie"));
    cookieSession.set("sessionSecret", session.secret);

    const cookieHeader = await commitSession(cookieSession);

    return redirect("/", {
      headers: {
        "Set-Cookie": cookieHeader,
      },
    });

  } catch (error: any) {
    console.error("Login Error:", error);
    return { error: "Invalid credentials" };
  }
}

export default function Login() {
  const actionData = useActionData<typeof action>();

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md space-y-8 p-8 bg-white rounded-xl shadow-lg">
        <div className="text-center">
            <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">
            Sign in to your account
            </h2>
        </div>

        <Form method="post" className="mt-8 space-y-6">
          {actionData?.error && (
            <div className="text-red-500 text-sm text-center font-medium">
              {actionData.error}
            </div>
          )}
          
          <div className="-space-y-px rounded-md shadow-sm">
            <div>
              <label htmlFor="email-address" className="sr-only">Email address</label>
              <input
                id="email-address"
                name="email"
                type="email"
                required
                className="relative block w-full rounded-t-md border-0 py-1.5 px-2 text-black font-bold bg-white ring-1 ring-inset ring-gray-300 placeholder:text-gray-500 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                placeholder="Email address"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="relative block w-full rounded-b-md border-0 py-1.5 px-2 text-black font-bold bg-white ring-1 ring-inset ring-gray-300 placeholder:text-gray-500 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                placeholder="Password"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Sign in
            </button>
          </div>
        </Form>
      </div>
    </div>
  );
}
