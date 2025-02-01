import { Router, Request, Response } from 'express';
import { EventController } from '../controllers/EventController';
import { E } from '@faker-js/faker/dist/airline-D6ksJFwG';

const router = Router();

router.get('/', EventController.getAllEvents.bind(EventController));
router.post('/location', EventController.getEventsByLocation.bind(EventController));
router.get('/:eventId', EventController.getEventById.bind(EventController));
router.get('/:calendarId', EventController.getEventsByCalendar.bind(EventController));
router.post('/:calendarId', EventController.createEvent.bind(EventController));
router.patch('/:eventId',EventController.updateEvent.bind(EventController));
router.delete('/:eventId', EventController.deleteEvent.bind(EventController));

export default router;
