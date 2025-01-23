import { Router, Request, Response } from 'express';

const router = Router();

router.get('/', (req: Request, res: Response) => {
	res.json({ message: 'Get all users' });
});

router.get('/:userId', (req: Request, res: Response) => {
	res.json({ message: `Get user with ID: ${req.params.userId}` });
});

router.get('/:userId/calendars', (req: Request, res: Response) => {
	res.json({ message: `Get calendars for user with ID: ${req.params.userId}` });
});

router.patch('/:userId', (req: Request, res: Response) => {
	res.json({ message: `Update user with ID: ${req.params.userId}` });
});

router.delete('/:userId', (req: Request, res: Response) => {
	res.json({ message: `Delete user with ID: ${req.params.userId}` });
});

export default router;
