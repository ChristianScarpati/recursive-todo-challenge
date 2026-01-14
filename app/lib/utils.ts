export interface Todo {
    $id: string;
    $createdAt: string;
    content: string;
    isCompleted: boolean;
    parentId: string | null;
    children?: Todo[];
}

export function buildTree(todos: Todo[]): Todo[] {
    const map = new Map<string, Todo>();
    const roots: Todo[] = [];

    // Initialize map and children array
    todos.forEach((todo) => {
        map.set(todo.$id, { ...todo, children: [] });
    });

    todos.forEach((todo) => {
        const node = map.get(todo.$id)!;
        if (todo.parentId && map.has(todo.parentId)) {
            const parent = map.get(todo.parentId)!;
            parent.children?.push(node);
        } else {
            roots.push(node);
        }
    });

    return roots;
}
