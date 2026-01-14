import { render, screen, fireEvent } from "@testing-library/react";
// import { createRemixStub } from "@remix-run/testing";


import { TodoItem } from "../app/components/TodoItem";
import { describe, it, expect } from "vitest";
import { createMemoryRouter, RouterProvider } from "react-router";

// Mock Todo data
const mockTodo = {
  $id: "1",
  $createdAt: "2023-01-01",
  content: "Buy Milk",
  isCompleted: false,
  parentId: null,
  userId: "user1",
  children: []
};

const mockTodoWithChildren = {
  ...mockTodo,
  children: [
    {
      $id: "2",
      $createdAt: "2023-01-01",
      content: "Almond Milk",
      isCompleted: false,
      parentId: "1",
      userId: "user1",
      children: []
    }
  ]
};

// Wrapper for Router context (needed for useFetcher)
function renderWithRouter(component: React.ReactNode) {
  const router = createMemoryRouter([
    {
      path: "/",
      element: component
    }
  ]);
  return render(<RouterProvider router={router} />);
}

describe("TodoItem", () => {
  it("renders todo content", () => {
    renderWithRouter(<TodoItem todo={mockTodo} />);
    expect(screen.getByText("Buy Milk")).toBeDefined();
  });

  it("renders children when present", () => {
    renderWithRouter(<TodoItem todo={mockTodoWithChildren} />);
    expect(screen.getByText("Almond Milk")).toBeDefined();
  });

});
