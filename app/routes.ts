import { type RouteConfig, index } from "@react-router/dev/routes";

export default [
    index("routes/home.tsx"),
    { path: "signup", file: "routes/signup.tsx"},
    { path: "login", file: "routes/login.tsx" },
] satisfies RouteConfig;
