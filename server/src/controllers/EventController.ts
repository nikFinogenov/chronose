import { Request, Response } from 'express';
import { Event } from '../models/Event';
import { Calendar } from '../models/Calendar';
import { User } from '../models/User';
import axios from 'axios';
import fs from 'fs';
import csv from 'csv-parser';
import { Permission } from '../models/Permission';
import { sendInviteEmail } from '../utils/emailService';
import { sign, verify } from 'jsonwebtoken';

async function getCalendarId(location: string): Promise<string | null> {
	return new Promise((resolve, reject) => {
		const results: Record<string, string>[] = [];

		fs.createReadStream('cal.csv')
			.pipe(csv())
			.on('data', data => results.push(data))
			.on('end', () => {
				// Find the row where the country label matches the location
				const row = results.find(row => row['Religion/Country'] === location);
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
			.on('error', err => reject(err));
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
				where: { id: eventId },
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
		const { title, description, startDate, endDate, color } = req.body;

		// console.log(req.body);

		try {
			const calendar = await Calendar.findOne({ where: { id: calendarId } });

			if (!calendar) {
				return res.status(404).json({ message: 'Calendar not found' });
			}

			const event = new Event();
			event.title = title;
			event.description = description;
			event.startDate = new Date(startDate);
			event.endDate = new Date(endDate);
			event.color = color;
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
		const { title, description, start, end, color } = req.body;

		try {
			const event = await Event.findOne({ where: { id: eventId } });

			if (!event) {
				return res.status(404).json({ message: 'Event not found' });
			}

			if (title) event.title = title;
			if (description) event.description = description;
			if (start) event.startDate = new Date(start);
			if (end) event.endDate = new Date(end);
			if (color) event.color = color;

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
			const event = await Event.findOne({ where: { id: eventId } });

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
				where: { id: calendarId },
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
	}, //tozhe samoe est v calendar controllere -_-  ->  .|.

	async getEventsByLocation(req: Request, res: Response): Promise<Response> {
		const { country } = req.body;
		try {
			// Get the calendar ID for the location
			const calendarId = await getCalendarId(country);
			if (!calendarId) {
				return res.status(404).json({ error: `No calendar found for location: ${country}` });
			}
			// console.log(calendarId)

			// Make the request to Google Calendar API
			const url = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events?key=${process.env.API_KEY}`;
			// console.log(url);
			axios
				.get(url)
				.then(response => {
					res.status(200).json(response.data);
				})
				.catch(error => {
					return res.status(500).json({ error: 'Error fetching events', message: error.message });
				});
		} catch (error) {
			console.error(error);
			return res.status(500).json({ message: `Error fetching events for ${country.label}` });
		}
	},

	async inviteUserToEvent(req: Request, res: Response): Promise<Response> {
		const { eventId } = req.params;
		const { email, role } = req.body; // Email приглашенного + его права
		const userId = req.user.id;

		try {
			const event = await Event.findOne({ where: { id: eventId }, relations: ['calendar'] });

			if (!event) {
				return res.status(404).json({ message: 'Event not found' });
			}

			// Проверяем, что приглашает владелец календаря
			const permission = await Permission.findOne({
				where: {
					calendar: event.calendar,
					user: { id: String(userId) },
					role: 'owner',
				},
			});

			if (!permission) {
				return res.status(403).json({ message: 'Only the calendar owner can invite users' });
			}

			// Генерируем JWT-токен с информацией о приглашении
			const inviteToken = sign({ email, eventId, role }, process.env.SECRET_KEY!, { expiresIn: '7d' });
			const inviteUrl = `${process.env.FRONT_URL}/events/join/${inviteToken}`;

			await sendInviteEmail(email, inviteUrl, role, 'event');

			return res.json({ message: 'Invitation sent successfully' });
		} catch (error) {
			console.error(error);
			return res.status(500).json({ message: 'Error sending invitation' });
		}
	},

	async joinEvent(req: Request, res: Response): Promise<Response> {
		const { inviteToken } = req.params;
		const userId = req.user.id; // Авторизованный пользователь

		try {
			// Расшифровываем токен
			const decoded: any = verify(inviteToken, process.env.SECRET_KEY!);
			if (!decoded) {
				return res.status(400).json({ message: 'Invalid or expired invite token' });
			}

			const { email, eventId, role } = decoded;

			// Ищем пользователя по ID
			const user = await User.findOne({ where: { id: String(userId) } });
			if (!user) {
				return res.status(404).json({ message: 'User not found' });
			}

			// Проверяем, что email совпадает
			if (user.email !== email) {
				return res.status(403).json({ message: 'This invite is not for you' });
			}

			// Проверяем, что пользователь еще не добавлен в событие
			const existingPermission = await Permission.findOne({ where: { user, event: { id: eventId } } });
			if (existingPermission) {
				return res.status(400).json({ message: 'User is already in the event' });
			}

			// Добавляем пользователя с указанной ролью
			const newPermission = Permission.create({ user, event: { id: eventId }, role });
			await newPermission.save();

			return res.json({ message: 'Successfully joined the event' });
		} catch (error) {
			console.error(error);
			return res.status(500).json({ message: 'Error joining event' });
		}
	},
};
