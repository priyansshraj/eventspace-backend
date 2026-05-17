import express from "express";
import {
  applyToEvent,
  getEventApplicants,
  updateApplicantsStatus,
} from "../controllers/application.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/role.middleware.js";
import { getMyApplications } from "../controllers/application.controller.js";
const router = express.Router();

router.get(
  "/my",
  authMiddleware,
  authorizeRoles("PARTICIPANT"),
  getMyApplications,
);

router.get(
  "/event/:eventId",
  authMiddleware,
  authorizeRoles("ORGANIZER"),
  getEventApplicants,
);

router.put(
  "/:id",
  authMiddleware,
  authorizeRoles("ORGANIZER"),
  updateApplicantsStatus,
);

router.post(
  "/:eventId",
  authMiddleware,
  authorizeRoles("PARTICIPANT"),
  applyToEvent,
);

export default router;
