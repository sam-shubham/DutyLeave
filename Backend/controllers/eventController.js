import eventModel from "../models/eventModel.js";
import userModel from "../models/userModel.js";

//create event
export const createEventController = async (req, res) => {
  try {
    const { title, description, startTime, endTime } = req.body;

    if (!title || !description || !startTime || !endTime) {
      return res.status(400).send({
        success: false,
        message: "All the fields are mandatory!",
      });
    }

    const attendees = JSON.parse(req.body.attendees);
    const faculty = JSON.parse(req.body.faculty);

    const event = new eventModel({
      title,
      description,
      startTime,
      endTime,
      faculty: faculty,
    });

    for (const attendeeId of attendees) {
      if (attendeeId) {
        event.attendees.push({
          user: attendeeId,
          // attended: attendee.attended || false,
        });
      }
    }

    await event.save();

    res.status(200).send({
      success: true,
      message: "Event created successfully!",
      event,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error creating event!",
      error,
    });
  }
};

export const getEventFaculty = async (req, res) => {
  try {
    const { allFacultyIds } = req.query;
    // console.log(allFacultyIds);

    const facultyData = await userModel
      .find({ _id: { $in: allFacultyIds } })
      .select("-password");

    // console.log(facultyData);

    res.status(200).send({
      success: true,
      message: "Faculty details fetched successfully!",
      facultyData,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Failed to fetch faculties details!",
      error,
    });
  }
};

export const getEventAttendees = async (req, res) => {
  try {
    const { allUserIds } = req.query;
    // console.log(allUserIds);

    const attendeesData = await userModel
      .find({ _id: { $in: allUserIds } })
      .select("-password");

    // console.log(attendeesData);

    res.status(200).send({
      success: true,
      message: "Attendees details fetched successfully!",
      attendeesData,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Failed to fetch attendees' details!",
      error,
    });
  }
};

// get events
export const getEventsController = async (req, res) => {
  try {
    const events = await eventModel.find({}).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      message: "All events ",
      events,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Erorr in getting events!",
      error: error.message,
    });
  }
};

//delete event
export const deleteEventController = async (req, res) => {
  try {
    await eventModel.findByIdAndDelete(req.params.id);
    res.status(200).send({
      success: true,
      message: "Event deleted successfully!",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while deleting event!",
      error,
    });
  }
};

export const getSingleEventController = async (req, res) => {
  try {
    const eventId = req.params.id;

    if (!eventId) {
      return res.status(404).send({
        success: false,
        message: "No id is there!",
      });
    }
    console.log(eventId);

    const eventData = await eventModel.findById(eventId);

    console.log(eventData);

    res.status(200).send({
      success: true,
      message: "Event data fetched successfully!",
      eventData,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in fetching event data!",
    });
  }
};

export const updateEventController = async (req, res) => {
  try {
    const { title, description, startTime, endTime, faculty } = req.body;

    const updatedEvent = {
      title,
      description,
      startTime,
      endTime,
      faculty: JSON.parse(faculty),
      attendees: [],
    };

    const event = await eventModel.findByIdAndUpdate(
      req.params.id,
      updatedEvent,
      { new: true }
    );

    const attendees = JSON.parse(req.body.attendees);

    for (const attendeeId of attendees) {
      if (attendeeId) {
        event.attendees.push({
          user: attendeeId,
          // attended: attendee.attended || false,
        });
      }
    }

    const updatedEventWithAttendees = await event.save();

    if (!event) {
      return res.status(404).send({
        success: false,
        message: "Event not found!",
      });
    }

    res.status(200).send({
      success: true,
      message: "Event updated successfully!",
      event: updatedEventWithAttendees,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error in updating event!",
    });
  }
};
