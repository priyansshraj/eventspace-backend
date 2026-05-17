import express from "express";
import { createEvent } from "../controllers/event.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/role.middleware.js";
import { create } from "domain";
import { getAllEvents, getMyEvents, deleteEvent } from "../controllers/event.controller.js";

const router = express.Router();

//Only organizer can create event
router.post("/", authMiddleware, authorizeRoles("ORGANIZER"), createEvent);

// Public route
router.get("/", getAllEvents);

//Organizer-only route
router.get("/my", authMiddleware, authorizeRoles("ORGANIZER"), getMyEvents);

router.delete("/:id", authMiddleware, authorizeRoles("ORGANIZER"), deleteEvent);

export default router;