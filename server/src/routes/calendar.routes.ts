import { Router, Request, Response } from 'express';

const router = Router();

router.get('/', (req: Request, res: Response) => {
	res.json({ message: 'Get all calendars' });
});

router.get('/:calendarId', (req: Request, res: Response) => {
	res.json({ message: `Get calendar with ID: ${req.params.calendarId}` });
});

router.post('/', (req: Request, res: Response) => {
	res.json({ message: 'Create a new calendar' });
});

router.patch('/:calendarId', (req: Request, res: Response) => {
	res.json({ message: `Update calendar with ID: ${req.params.calendarId}` });
});

router.delete('/:calendarId', (req: Request, res: Response) => {
	res.json({ message: `Delete calendar with ID: ${req.params.calendarId}` });
});

export default router;
