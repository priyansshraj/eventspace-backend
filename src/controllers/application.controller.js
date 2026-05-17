import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
export const applyToEvent = async (req, res) => {
  try {
    const eventId = parseInt(req.params.eventId);

    if (isNaN(eventId)) {
      return res.status(400).json({ message: "Invalid event ID" });
    }

    // check event exists
    const event = await prisma.event.findUnique({
      where: {
        id: eventId,
      },
    });

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Prevent Organizer from Applying to Own Event
    if (event.organizerId === req.user.userId) {
      return res.status(400).json({
        message: "You cannot apply to your own event",
      });
    }

    // create application
    const application = await prisma.application.create({
      data: {
        userId: req.user.userId,
        eventId: eventId,
      },
    });

    res.status(201).json({
      message: "Applied Successfully.",
      application,
    });
  } catch (error) {
    // handle duplicate apply (unique constraint)
    if (error.code === "P2002") {
      return res.status(400).json({
        message: "You have already applied to this event",
      });
    }

    res.status(500).json({ error: error.message });
  }
};

export const getMyApplications = async (req, res) => {
  try {
    const applications = await prisma.application.findMany({
      where: {
        userId: req.user.userId,
      },
      include: {
        event: true, //includes event details
      },
    });
    res.json(applications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getEventApplicants = async (req, res) => {
  try {
    const eventId = parseInt(req.params.eventId);

    // 1. check ownership
    const event = await prisma.event.findUnique({
      where: { id: eventId },
    });

    if (!event) {
      return res.status(404).json({ message: "Event not found." });
    }

    if (event.organizerId !== req.user.userId) {
      return res.status(403).json({ message: "Forbidden" });
    }

    // 2. get applicants
    const applications = await prisma.application.findMany({
      where: { eventId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
    res.json(applications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateApplicantsStatus = async (req, res) => {
  try {
    const applicationId = parseInt(req.params.id);
    const { status } = req.body;
    const allowedStatus = ["APPROVED", "REJECTED"];

    if (!allowedStatus.includes(status)) {
      return res.status(400).json({
        message: "Invalid status value",
      });
    }

    const application = await prisma.application.findUnique({
      where: { id: applicationId },
      include: { event: true },
    });

    if (!application) {
      return res.status(404).json({ message: "Application not found." });
    }

    //ownership check
    if (application.event.organizerId !== req.user.userId) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const updated = await prisma.application.update({
      where: { id: applicationId },
      data: { status },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
