import { Router, Request, Response } from 'express';

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

export default router;
