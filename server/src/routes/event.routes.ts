import { Router, Request, Response } from 'express';
<<<<<<< HEAD

const router = Router();

router.get('/', (req: Request, res: Response) => {
	res.json({ message: 'Get all events' });
});

router.get('/:eventId', (req: Request, res: Response) => {
	res.json({ message: `Get event with ID: ${req.params.eventId}` });
});

router.post('/', (req: Request, res: Response) => {
	res.json({ message: 'Create a new event' });
});

router.patch('/:eventId', (req: Request, res: Response) => {
	res.json({ message: `Update event with ID: ${req.params.eventId}` });
});

router.delete('/:eventId', (req: Request, res: Response) => {
	res.json({ message: `Delete event with ID: ${req.params.eventId}` });
});
=======
import { EventController } from '../controllers/EventController';
import { E } from '@faker-js/faker/dist/airline-D6ksJFwG';

const router = Router();

router.get('/', EventController.getAllEvents.bind(EventController));
router.post('/location', EventController.getEventsByLocation.bind(EventController));
router.get('/:eventId', EventController.getEventById.bind(EventController));
router.post('/', EventController.createEvent.bind(EventController));
router.patch('/:eventId',EventController.updateEvent.bind(EventController));
router.delete('/:eventId', EventController.deleteEvent.bind(EventController));
>>>>>>> 65156c1367936da257920441ac52f0aadae5bc4d

export default router;
