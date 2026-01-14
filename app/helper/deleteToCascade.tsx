import { Query } from "node-appwrite";

export async function deleteTodoCascade(databases: any, dbId: string, collId: string, todoId: string, userId: string) {
  const children = await databases.listDocuments(dbId, collId, [
    Query.equal("parentId", todoId),
    Query.equal("userId", userId),
    Query.limit(100),
  ]);

  for (const child of children.documents) {
    await deleteTodoCascade(databases, dbId, collId, child.$id, userId);
  }

  await databases.deleteDocument(dbId, collId, todoId);
}
