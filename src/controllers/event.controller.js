import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createEvent = async (req, res) => {
  try {
    const { title, description, date, location } = req.body;

    const event = await prisma.event.create({
      data: {
        title,
        description,
        date: new Date(date),
        location,
        organizerId: req.user.userId,
      },
    });

    res.status(201).json({
      message: "Event created successfully.",
      event,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAllEvents = async (req, res) => {
  try {
    const events = await prisma.event.findMany({
      include: {
        organizer: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    res.json(events);
  } catch (error) {
    res.status(500).json({error: error.message});
  }
};

export const getMyEvents = async (req,res)=>{
    try{
        const events = await prisma.event.findMany({
            where:{
                organizerId: req.user.userId,
            },
        });

        res.json(events);
    }catch(error){
        res.status(500).json({error: error.message});
    }
};


export const deleteEvent = async (req, res) => {
  try {
    const eventId = parseInt(req.params.id);

    // check event exists
    const event = await prisma.event.findUnique({
      where: { id: eventId },
    });

    if (!event) {
      return res.status(404).json({ message: "Event not found." });
    }

    //ownership check
    if (event.organizerId !== req.user.userId) {
      return res.status(403).json({
        message: "Forbidden: You can only delete your own events",
      });
    }

    // delete event
    await prisma.event.delete({
      where: {
        id: eventId,
      },
    });

    res.json({ message: "Event deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
