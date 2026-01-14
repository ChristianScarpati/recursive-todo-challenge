import type { Route } from "./+types/home";
import { redirect, useLoaderData } from "react-router";
import { createSessionClient, APPWRITE_DB_ID, APPWRITE_COLLECTION_ID } from "../lib/appwrite.server";
import { getSession, destroySession } from "../sessions.server";
import { buildTree } from "../lib/utils";
import { TodoItem, NewTodoForm } from "../components/TodoItem";
import { Query, ID } from "node-appwrite";

export function meta({ }: Route.MetaArgs) {
  return [{ title: "My Tasks - Recursive Todo" }];
}

export async function loader({ request }: Route.LoaderArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  const secret = session.get("sessionSecret");

  console.log("Home Loader: Checking session...");
  if (!secret) {
    console.log("Home Loader: No secret found. Redirecting to login.");
    throw redirect("/login");
  } else {
    console.log("Home Loader: Secret found.");
  }

  try {
    const { databases, account } = createSessionClient(secret);
    const user = await account.get();

    // Fetch Todos
    const todoList = await databases.listDocuments(
      APPWRITE_DB_ID,
      APPWRITE_COLLECTION_ID,
      [Query.equal("userId", user.$id), Query.limit(100), Query.orderDesc("$createdAt")]
    );

    const tree = buildTree(todoList.documents as any);

    return { user, tree, todos: todoList.documents };
  } catch (error) {
    console.error("Loader Error", error);
    // If session invalid, logout
    throw redirect("/login", {
      headers: {
        "Set-Cookie": await destroySession(session),
      },
    });
  }
}

export async function action({ request }: Route.ActionArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  const secret = session.get("sessionSecret");
  if (!secret) return redirect("/login");

  const { databases, account } = createSessionClient(secret);

  const formData = await request.formData();
  const intent = formData.get("intent");
  const user = await account.get();

  if (intent === "create") {
    const content = formData.get("content") as string;
    const parentId = formData.get("parentId") as string | null;

    if (!content) return { error: "Content required" };

    await databases.createDocument(
      APPWRITE_DB_ID,
      APPWRITE_COLLECTION_ID,
      ID.unique(),
      {
        content,
        isCompleted: false,
        parentId: parentId || null,
        userId: user.$id,
        createdAt: new Date().toISOString()
      }
    );
  } else if (intent === "toggle") {
    const todoId = formData.get("todoId") as string;

    const todo = await databases.getDocument(APPWRITE_DB_ID, APPWRITE_COLLECTION_ID, todoId);
    await databases.updateDocument(APPWRITE_DB_ID, APPWRITE_COLLECTION_ID, todoId, {
      isCompleted: !todo.isCompleted
    });
  } else if (intent === "delete") {
    const todoId = formData.get("todoId") as string;
    await databases.deleteDocument(APPWRITE_DB_ID, APPWRITE_COLLECTION_ID, todoId);
  }

  return { success: true };
}

export default function Home() {
  const { user, tree } = useLoaderData<typeof loader>();

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Tasks</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">Hello, {user.name}</span>
            {/* Logout should go  here */}
          </div>
        </div>

        <div className="bg- white p-6 rounded-xl shadow-sm border border-gray-100 bg-white mb-6">
          <NewTodoForm />
        </div>

        <div className="space-y-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          {tree.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No tasks yet. Add one above!</p>
          ) : (
            tree.length > 0 && tree.map(todo => (
              <TodoItem key={todo.$id} todo={todo} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
