import { Request, Response } from 'express';
import { Calendar } from '../models/Calendar';
import { User } from '../models/User';
import { Event } from '../models/Event';

export const CalendarController = {
	async getAllCalendars(req: Request, res: Response): Promise<Response> {
		try {
			const calendars = await Calendar.find({ relations: ['owner', 'events', 'users'] });
			return res.status(200).json(calendars);
		} catch (error) {
			console.error(error);
			return res.status(500).json({ message: 'Error fetching calendars' });
		}
	},

	async getOwnerByCalendarId(req: Request, res: Response): Promise<Response> {
		const { calendarId } = req.params;

		try {
			const calendar = await Calendar.findOne({
				where: { id: calendarId },
				relations: ['owner', 'events', 'users'],
			});

			if (!calendar) {
				return res.status(404).json({ message: 'Calendar not found' });
			}

			return res.status(200).json({ owner: calendar.owner });
		} catch (error) {
			console.error(error);
			return res.status(500).json({ message: 'Error fetching owner' });
		}
	},

	async getCalendarById(req: Request, res: Response): Promise<Response> {
		const { calendarId } = req.params;

		try {
			const calendar = await Calendar.findOne({
				where: { id: calendarId },
				relations: ['owner', 'users', 'events'],
			});

			if (!calendar) {
				return res.status(404).json({ message: 'Calendar not found' });
			}

			return res.status(200).json(calendar);
		} catch (error) {
			console.error(error);
			return res.status(500).json({ message: 'Error fetching calendar' });
		}
	},

	async createCalendar(req: Request, res: Response): Promise<Response> {
		const { name, description, ownerId } = req.body;

		try {
			const owner = await User.findOne({ where: { id: ownerId } });
			if (!owner) {
				return res.status(404).json({ message: 'Owner not found' });
			}

			const newCalendar = Calendar.create({
				name,
				description,
				owner,
			});

			await newCalendar.save();

			return res.status(201).json(newCalendar);
		} catch (error) {
			console.error(error);
			return res.status(500).json({ message: 'Error creating calendar' });
		}
	},

	async updateCalendar(req: Request, res: Response): Promise<Response> {
		const { calendarId } = req.params;
		const { name, description } = req.body;

		try {
			const calendar = await Calendar.findOne({ where: { id: calendarId } });

			if (!calendar) {
				return res.status(404).json({ message: 'Calendar not found' });
			}

			if (name) calendar.name = name;
			if (description) calendar.description = description;

			await calendar.save();

			return res.status(200).json(calendar);
		} catch (error) {
			console.error(error);
			return res.status(500).json({ message: 'Error updating calendar' });
		}
	},

	async deleteCalendar(req: Request, res: Response): Promise<Response> {
		const { calendarId } = req.params;

		try {
			const calendar = await Calendar.findOne({ where: { id: calendarId } });

			if (!calendar) {
				return res.status(404).json({ message: 'Calendar not found' });
			}

			await calendar.remove();

			return res.status(200).json({ message: 'Calendar successfully deleted' });
		} catch (error) {
			console.error(error);
			return res.status(500).json({ message: 'Error deleting calendar' });
		}
	},

	async getUsersInCalendar(req: Request, res: Response): Promise<Response> {
		const { calendarId } = req.params;

		try {
			const calendar = await Calendar.findOne({
				where: { id: calendarId },
				relations: ['users'],
			});

			if (!calendar) {
				return res.status(404).json({ message: 'Calendar not found' });
			}

			return res.status(200).json(calendar.users);
		} catch (error) {
			console.error(error);
			return res.status(500).json({ message: 'Error fetching users in calendar' });
		}
	},

	async addUserToCalendar(req: Request, res: Response): Promise<Response> {
		const { calendarId } = req.params;
		const { email } = req.body;

		if (!email) {
			return res.status(400).json({ message: 'Email is required' });
		}

		try {
			const calendar = await Calendar.findOne({
				where: { id: calendarId },
				relations: ['users'],
			});

			if (!calendar) {
				return res.status(404).json({ message: 'Calendar not found' });
			}

			const user = await User.findOne({ where: { email } });

			if (!user) {
				return res.status(404).json({ message: 'User not found' });
			}

			if (calendar.users.some(u => u.id === user.id)) {
				return res.status(400).json({ message: 'User is already in the calendar' });
			}

			calendar.users.push(user);
			await calendar.save();

			return res.status(200).json({ message: 'User successfully added to the calendar' });
		} catch (error) {
			console.error(error);
			return res.status(500).json({ message: 'Error adding user to calendar' });
		}
	},

	async removeUserFromCalendar(req: Request, res: Response): Promise<Response> {
		const { calendarId, userId } = req.params;

		try {
			const calendar = await Calendar.findOne({
				where: { id: calendarId },
				relations: ['users'],
			});

			if (!calendar) {
				return res.status(404).json({ message: 'Calendar not found' });
			}

			const userIndex = calendar.users.findIndex(u => u.id === userId);

			if (userIndex === -1) {
				return res.status(404).json({ message: 'User not found in the calendar' });
			}

			calendar.users.splice(userIndex, 1);
			await calendar.save();

			return res.status(200).json({ message: 'User successfully removed from the calendar' });
		} catch (error) {
			console.error(error);
			return res.status(500).json({ message: 'Error removing user from calendar' });
		}
	},

	async getEventsInCalendar(req: Request, res: Response): Promise<Response> {
		const { calendarId } = req.params;

		try {
			const calendar = await Calendar.findOne({
				where: { id: calendarId },
				relations: ['events'],
			});

			if (!calendar) {
				return res.status(404).json({ message: 'Calendar not found' });
			}

			return res.status(200).json({ events: calendar.events });
		} catch (error) {
			console.error(error);
			return res.status(500).json({ message: 'Error fetching events' });
		}
	},

	async createEventInCalendar(req: Request, res: Response): Promise<Response> {
		const { calendarId } = req.params;
		const { title, description, startDate, endDate } = req.body;

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
			event.calendar = calendar;

			await event.save();

			return res.status(201).json({ message: `Event created in calendar with ID: ${calendarId}`, event });
		} catch (error) {
			console.log(error);
			return res.status(500).json({ message: 'Error creating event' });
		}
	},

	async getInviteLink(req: Request, res: Response) {
		const { calendarId } = req.params;
		const userId = req.user.id; // предполагается, что ID пользователя есть в req.user

		try {
			const calendar = await Calendar.findOne({
				where: { id: calendarId },
				relations: ['owner'],
			});

			if (!calendar) {
				return res.status(404).json({ message: 'Calendar not found' });
			}

			// Проверяем, является ли пользователь владельцем
			if (calendar.owner.id !== userId) {
				return res.status(403).json({ message: 'Only the calendar owner can generate an invite link' });
			}

			const inviteLink = `${process.env.BACK_URL}/api/calendar/join/${calendar.inviteToken}`;
			return res.json({ inviteLink });
		} catch (error) {
			console.error(error);
			return res.status(500).json({ message: 'Error generating invite link' });
		}
	},

	async joinCalendar(req: Request, res: Response) {
		const { inviteToken } = req.params;
		const userId = req.body.userId;

		try {
			const calendar = await Calendar.findOne({
				where: { inviteToken },
				relations: ['users'],
			});

			if (!calendar) {
				return res.status(404).json({ message: 'Invalid or expired invite link' });
			}

			const user = await User.findOne({ where: { id: userId } });

			if (!user) {
				return res.status(404).json({ message: 'User not found' });
			}

			if (calendar.users.some(u => u.id === user.id)) {
				return res.status(400).json({ message: 'You are already in this calendar' });
			}

			calendar.users.push(user);
			await calendar.save();

			return res.json({ message: 'Joined the calendar successfully', calendar });
		} catch (error) {
			console.error(error);
			return res.status(500).json({ message: 'Error joining calendar' });
		}
	},
};
