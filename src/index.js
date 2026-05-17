import express from "express";
import "dotenv/config";
import authRoutes from "./routes/auth.routes.js";
import { authMiddleware } from "./middleware/auth.middleware.js";
import { authorizeRoles } from "./middleware/role.middleware.js";
import eventRoutes from "./routes/event.routes.js";
import applicationRoutes from "./routes/application.routes.js";
import cors from "cors";

const app = express();

app.use(express.json());

app.use(cors());

app.use("/api/auth", authRoutes);

app.use("/api/events", eventRoutes);

app.use("/api/applications", applicationRoutes);

// Testing
app.get("/api/test", authMiddleware, (req, res) => {
  res.json({
    message: "Protected route working",
    user: req.user,
  });
});

//Organiser only route
app.get(
  "/api/organizer-test",
  authMiddleware,
  authorizeRoles("ORGANIZER"),
  (req, res) => {
    res.json({ message: "Organizer access granted." });
  },
);

//Participants only route
app.get(
  "/api/participant-test",
  authMiddleware,
  authorizeRoles("PARTICIPANT"),
  (req, res) => {
    res.json({
      message: "Participants access granted",
    });
  },
);

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
