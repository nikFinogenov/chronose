import { Request, Response } from 'express';
import { Event } from '../models/Event';
import { Calendar } from '../models/Calendar';

export class EventController {
    async createEvent(req: Request, res: Response): Promise<Response> {
        try {
            const { calendarId, title, description, startDate, endDate } = req.body;

            const calendar = await Calendar.findOne({ where: { id: calendarId } });
            if (!calendar) {
                return res.status(404).json({ message: 'Calendar not found' });
            }

            const event = Event.create({
                title,
                description,
                startDate: new Date(startDate),
                endDate: new Date(endDate),
                calendar,
            });

            await event.save();
            return res.status(201).json(event);
        } catch (error) {
            return res.status(500).json({ message: 'Error creating event', error });
        }
    }

    async getEventsByCalendar(req: Request, res: Response): Promise<Response> {
        try {
            const { calendarId } = req.params;

            const calendar = await Calendar.findOne({ where: { id: parseInt(calendarId) }, relations: ['events'] });
            if (!calendar) {
                return res.status(404).json({ message: 'Calendar not found' });
            }

            return res.status(200).json(calendar.events);
        } catch (error) {
            return res.status(500).json({ message: 'Error fetching events', error });
        }
    }

    async updateEvent(req: Request, res: Response): Promise<Response> {
        try {
            const { eventId } = req.params;
            const { title, description, startDate, endDate } = req.body;

            const event = await Event.findOne({ where: { id: parseInt(eventId) } });
            if (!event) {
                return res.status(404).json({ message: 'Event not found' });
            }

            event.title = title || event.title;
            event.description = description || event.description;
            event.startDate = startDate ? new Date(startDate) : event.startDate;
            event.endDate = endDate ? new Date(endDate) : event.endDate;

            await event.save();
            return res.status(200).json(event);
        } catch (error) {
            return res.status(500).json({ message: 'Error updating event', error });
        }
    }

    async deleteEvent(req: Request, res: Response): Promise<Response> {
        try {
            const { eventId } = req.params;

            const event = await Event.findOne({ where: { id: parseInt(eventId) } });
            if (!event) {
                return res.status(404).json({ message: 'Event not found' });
            }

            await event.remove();
            return res.status(200).json({ message: 'Event deleted successfully' });
        } catch (error) {
            return res.status(500).json({ message: 'Error deleting event', error });
        }
    }
}
