import { Router } from 'express';
import { CalendarController } from '../controllers/CalendarController';
import { authMiddleware } from '../middlewares/Auth';

const router = Router();

// Calendars
router.get('/', CalendarController.getAllCalendars.bind(CalendarController));

router.get('/owner/:calendarId', CalendarController.getOwnerByCalendarId.bind(CalendarController));

router.get('/:calendarId', CalendarController.getCalendarById.bind(CalendarController));

router.post('/', CalendarController.createCalendar.bind(CalendarController));

router.patch('/:calendarId', CalendarController.updateCalendar.bind(CalendarController));

router.delete('/:calendarId', CalendarController.deleteCalendar.bind(CalendarController));

// Users in Calendar
router.get('/:calendarId/users', CalendarController.getUsersInCalendar.bind(CalendarController));

router.post('/:calendarId/users', CalendarController.addUserToCalendar.bind(CalendarController));

router.delete('/:calendarId/users/:userId', CalendarController.removeUserFromCalendar.bind(CalendarController));

// Events in Calendar
router.get('/:calendarId/events', CalendarController.getEventsInCalendar.bind(CalendarController));

router.post('/:calendarId/events', CalendarController.createEventInCalendar.bind(CalendarController));

router.get('/invite/:calendarId', authMiddleware, CalendarController.getInviteLink.bind(CalendarController)); 

router.post('/join/:inviteToken', authMiddleware, CalendarController.joinCalendar.bind(CalendarController));

export default router;
