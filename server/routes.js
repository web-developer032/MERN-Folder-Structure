import userRoutes from "./api/user/user.routes.js";

// app.use("/api/users", userRoutes);

export default [
  {
    path: "users",
    router: userRoutes,
  },
];
