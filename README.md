# Recursive To-Do App

A recursive To-Do application built with **Remix (React Router v7)**, **TypeScript**, **TailwindCSS**, and **Appwrite**.

## Setup

1.  **Clone the repository**.
2.  **Install dependencies**:
    ```bash
    npm install
    ```
3.  **Appwrite Setup**:
    -   Create a project on [Appwrite Cloud](https://cloud.appwrite.io).
    -   Copy `.env.example` to `.env` and fill in your Project ID, API Key, and Endpoint.
    -   Run the setup script to create Database and Collection:
        ```bash
        node scripts/init-appwrite.js
        ```
        (Make sure to set env vars before running or inline them).

4.  **Run Development Server**:
    ```bash
    npm run dev
    ```

5.  **Run Tests**:
    Ensure you are in the `recursive-todo` directory.
    ```bash
    npm run test
    ```

## CI/CD Plan (DevOps Thought Exercise)

To ensure quality and smooth deployment used in a production environment, I would implement the following CI/CD pipeline:

### Pipeline Stages

1.  **Lint & formatting**:
    -   Run `eslint` and `prettier --check` to ensure code quality.
    -   Ideally run strict type checking (`tsc --noEmit`).

2.  **Test**:
    -   Run Unit and Integration tests using `vitest`.
    -   (Optional) E2E tests using **Playwright** against a staging environment (or mocked Appwrite).

3.  **Build**:
    -   Run `npm run build` to verify the application builds successfully.

4.  **Deploy**:
    -   **Staging**: Automatically deploy `develop` branch to a staging URL (e.g., Vercel Preview).
    -   **Production**: Deploy `main` branch to production upon manual approval or successful merge.
    -   **Appwrite Functions**: Deploy functions using Appwrite CLI (`appwrite deploy functions`) as part of the pipeline.

### Tools

-   **GitHub Actions**: Primary CI/CD runner. It integrates well with the repo and has actions for Node.js, Vercel, and Appwrite.
-   **Vercel**: Hosting provider for the Remix frontend. Zero-config deployments.
-   **Appwrite CLI**: For managing backend schema and function deployments programmatically.

## Features

-   **Recursive Todo List**: Creating nested tasks infinitely.
-   **Authentication**: Signup/Login via Appwrite.
-   **Optimistic UI**: Fast interactions locally.
-   **Security**: Server-side session validation.
