import { Router, Request, Response } from "express";
import { Calendar } from "../entity/Calendar";

const router = Router();
// const userRepository = AppDataSource.getRepository(Event);

// Получить всех пользователей
router.get("/", async (req: Request, res: Response) => {
    // try {
    //     const events = await Event.find({ relations: ["calendar"] });
    //     res.json(events);
    // } catch (error) {
    //     res.status(500).json({ message: "Error fetching events", error });
    // }
});

// Создать нового пользователя
router.post("/", async (req: Request, res: Response) => {
    // try {
    //     const { title, description, startDate, endDate, calendar } = req.body;
    //     const newEvent = Event.create({
    //         title,
    //         description,
    //         startDate,
    //         endDate,
    //         calendar,
    //     });

    //     // Сохраняем событие в базе данных
    //     await newEvent.save();
    //     res.status(201).json(newEvent);
    // } catch (error) {
    //     console.log(error);
    //     res.status(500).json({ message: "Error creating event", error });
    // }
});

export default router;
