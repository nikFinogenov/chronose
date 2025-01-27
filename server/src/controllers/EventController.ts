<<<<<<< HEAD

=======
import { Request, Response } from 'express';
import { Event } from '../models/Event';
import { Calendar } from '../models/Calendar';
import axios from 'axios';
import fs from 'fs';
import csv from 'csv-parser';

async function getCalendarId(location: string): Promise<string | null> {
    return new Promise((resolve, reject) => {
        const results: Record<string, string>[] = [];

        fs.createReadStream('cal.csv')
            .pipe(csv())
            .on('data', (data) => results.push(data))
            .on('end', () => {
                // Find the row where the country label matches the location
                const row = results.find((row) => row['Religion/Country'] === location);
                if (row) {
                    const calendarId = row['calendarID'];
                    if (calendarId) {
                        resolve(calendarId); // Возвращаем найденный ID
                    } else {
                        resolve(process.env.CAL_ID || null); // Если ID пустой, вернуть значение из переменных окружения
                    }
                } else {
                    resolve(null); // No match found
                }
            })
            .on('error', (err) => reject(err));
    });
}

export const EventController = {
    async getAllEvents(req: Request, res: Response): Promise<Response> {
        try {
            const events = await Event.find({ relations: ['calendar'] });
            return res.status(200).json(events);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Error fetching events' });
        }
    },

    async getEventById(req: Request, res: Response): Promise<Response> {
        const { eventId } = req.params;

        try {
            const event = await Event.findOne({
                where: { id: Number(eventId) },
                relations: ['calendar'],
            });

            if (!event) {
                return res.status(404).json({ message: 'Event not found' });
            }

            return res.status(200).json(event);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Error fetching event' });
        }
    },

    async createEvent(req: Request, res: Response): Promise<Response> {
        const { calendarId } = req.params;
        const { title, description, startDate, endDate } = req.body;

        try {
            const calendar = await Calendar.findOne({ where: { id: Number(calendarId) } });

            if (!calendar) {
                return res.status(404).json({ message: 'Calendar not found' });
            }

            const event = new Event();
            event.title = title;
            event.description = description;
            event.startDate = new Date(startDate);
            event.endDate = new Date(endDate);
            event.calendar = calendar;

            await event.save();

            return res.status(201).json({ message: 'Event created successfully', event });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Error creating event' });
        }
    },

    async updateEvent(req: Request, res: Response): Promise<Response> {
        const { eventId } = req.params;
        const { title, description, startDate, endDate } = req.body;

        try {
            const event = await Event.findOne({ where: { id: Number(eventId) } });

            if (!event) {
                return res.status(404).json({ message: 'Event not found' });
            }

            if (title) event.title = title;
            if (description) event.description = description;
            if (startDate) event.startDate = new Date(startDate);
            if (endDate) event.endDate = new Date(endDate);

            await event.save();

            return res.status(200).json({ message: 'Event updated successfully', event });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Error updating event' });
        }
    },

    async deleteEvent(req: Request, res: Response): Promise<Response> {
        const { eventId } = req.params;

        try {
            const event = await Event.findOne({ where: { id: Number(eventId) } });

            if (!event) {
                return res.status(404).json({ message: 'Event not found' });
            }

            await event.remove();

            return res.status(200).json({ message: 'Event deleted successfully' });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Error deleting event' });
        }
    },

    async getEventsByCalendar(req: Request, res: Response): Promise<Response> {
        const { calendarId } = req.params;

        try {
            const calendar = await Calendar.findOne({
                where: { id: Number(calendarId) },
                relations: ['events'],
            });

            if (!calendar) {
                return res.status(404).json({ message: 'Calendar not found' });
            }

            return res.status(200).json(calendar.events);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Error fetching events for calendar' });
        }
    },//tozhe samoe est v calendar controllere -_-  ->  .|.

    async getEventsByLocation(req: Request, res: Response): Promise<Response> {
        const country = req.body;
        // console.log(country.label);
        try {
            // Get the calendar ID for the location
            const calendarId = await getCalendarId(country.label);
            if (!calendarId) {
                return res.status(404).json({ error: `No calendar found for location: ${country.label}` });
            }
            // console.log(calendarId)

            // Make the request to Google Calendar API
            const url = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events?key=${process.env.API_KEY}`;
            // console.log(url);
            axios.get(url)
                .then(response => {
                    res.status(200).json(response.data);
                })
                .catch(error => {
                    return res.status(500).json({ error: "Error fetching events", message: error.message });
                });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: `Error fetching events for ${country.label}` });
        }
    }
};
>>>>>>> 65156c1367936da257920441ac52f0aadae5bc4d
