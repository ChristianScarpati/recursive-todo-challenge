import { useState } from "react";
import { useFetcher } from "react-router";
import { ChevronRight, ChevronDown, Trash2, Plus } from "lucide-react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Todo } from "../lib/utils";

interface TodoItemProps {
  todo: Todo;
  level?: number;
}

export function TodoItem({ todo, level = 0 }: TodoItemProps) {
  const fetcher = useFetcher();
  const [isExpanded, setIsExpanded] = useState(true);
  const [isAddingSubtask, setIsAddingSubtask] = useState(false);

  // Optimistic UI updates
  const isCompleted = fetcher.formData
    ? fetcher.formData.get("intent") === "toggle"
      ? !todo.isCompleted
      : todo.isCompleted
    : todo.isCompleted;

  const isDeleting = fetcher.state !== "idle" && fetcher.formData?.get("intent") === "delete";

  if (isDeleting) return null;

  return (
    <div className={twMerge("group", level > 0 && "ml-6 border-l pl-2 border-gray-100")}>
      <div className="flex items-center gap-2 py-2 group-hover:bg-gray-50 rounded-md px-2 -mx-2 transition-colors">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={clsx("p-1 rounded hover:bg-gray-200 text-gray-400", !todo.children?.length && "invisible")}
        >
          {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
        </button>

        <fetcher.Form method="post" className="flex items-center gap-3 flex-1">
          <input type="hidden" name="todoId" value={todo.$id} />
          <input type="hidden" name="intent" value="toggle" />
          <button
            type="submit"
            className={clsx(
              "w-5 h-5 rounded border flex items-center justify-center transition-all",
              isCompleted ? "bg-indigo-600 border-indigo-600" : "border-gray-300 hover:border-indigo-500"
            )}
            title="Toggle completion"
          >
            {isCompleted && <span className="text-white text-xs">✓</span>}
          </button>

          <span className={clsx("text-sm transition-all flex-1 text-black font-medium", isCompleted && "text-gray-500 line-through")}>
            {todo.content}
          </span>
        </fetcher.Form>

        <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity gap-1">
          <button
            onClick={() => {
              setIsAddingSubtask(true);
              setIsExpanded(true);
            }}
            className="p-1.5 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded"
            title="Add subtask"
          >
            <Plus size={14} />
          </button>

          <fetcher.Form method="post" onSubmit={(e) => {
            if (!confirm("Delete this task and all subtasks?")) e.preventDefault();
          }}>
            <input type="hidden" name="todoId" value={todo.$id} />
            <input type="hidden" name="intent" value="delete" />
            <button
              type="submit"
              className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
              title="Delete task"
            >
              <Trash2 size={14} />
            </button>
          </fetcher.Form>
        </div>
      </div>

      {isAddingSubtask && (
        <div className="ml-9 mb-2">
          <NewTodoForm
            parentId={todo.$id}
            onCancel={() => setIsAddingSubtask(false)}
            autoFocus
          />
        </div>
      )}

      {isExpanded && todo.children && todo.children.length > 0 && (
        <div className="ml-2">
          {todo.children.map((child) => (
            <TodoItem key={child.$id} todo={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

function NewTodoForm({ parentId, onCancel, autoFocus }: { parentId?: string, onCancel?: () => void, autoFocus?: boolean }) {
  const fetcher = useFetcher();
  const isSubmitting = fetcher.state !== "idle";

  return (
    <fetcher.Form
      method="post"
      className="flex gap-2 items-center w-full"
      onSubmit={(e) => {
        setTimeout(() => {
          const form = e.target as HTMLFormElement;
          form.reset();
          onCancel?.();
        }, 100);
      }}
    >
      <input type="hidden" name="intent" value="create" />
      {parentId && <input type="hidden" name="parentId" value={parentId} />}
      <input
        name="content"
        type="text"
        placeholder={parentId ? "Add a subtask..." : "Add a new task..."}
        className="flex-1 text-sm border-gray-200 rounded-md focus:border-indigo-500 focus:ring-indigo-500 py-1.5 text-black font-bold bg-white"
        autoFocus={autoFocus}
        required
      />
      <div className="flex gap-1">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-3 py-1 bg-indigo-600 text-white text-xs font-medium rounded hover:bg-indigo-500 disabled:opacity-50"
        >
          Add
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-2 py-1 text-gray-500 text-xs hover:bg-gray-100 rounded"
          >
            Cancel
          </button>
        )}
      </div>
    </fetcher.Form>
  );
}

export { NewTodoForm }; 
