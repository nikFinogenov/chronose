import { Router } from 'express';
import { EventController } from '../controllers/EventController';
import { authMiddleware } from '../middlewares/Auth';

const router = Router();

router.get('/', EventController.getAllEvents.bind(EventController));
router.get('/location', EventController.getEventsByLocation.bind(EventController));
router.get('/:eventId', EventController.getEventById.bind(EventController));
router.get('/calendar/:calendarId', EventController.getEventsByCalendar.bind(EventController));
router.post('/calendar/:calendarId', authMiddleware, EventController.createEvent.bind(EventController));
router.post('/calendar/repeat/:calendarId', authMiddleware, EventController.createSequenceEvent.bind(EventController));
router.patch('/:eventId', authMiddleware, EventController.updateEvent.bind(EventController));
router.delete('/:eventId', authMiddleware, EventController.deleteEvent.bind(EventController));

// // Пригласительная ссылка в событие
router.get('/invite/:eventId', authMiddleware, EventController.inviteUserToEvent.bind(EventController));
router.post('/join/:eventId', authMiddleware, EventController.joinEvent.bind(EventController));

export default router;
