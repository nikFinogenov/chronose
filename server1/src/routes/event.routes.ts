import { Router, Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { User } from "../entity/User";

const router = Router();
const userRepository = AppDataSource.getRepository(User);

// Получить всех пользователей
router.get("/", async (req: Request, res: Response) => {
    try {
        const users = await userRepository.find({ relations: ["events"] });
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: "Error fetching users", error });
    }
});

// Создать нового пользователя
router.post("/", async (req: Request, res: Response) => {
    try {
        const { name, email } = req.body;
        const user = userRepository.create({ name, email });
        await userRepository.save(user);
        res.status(201).json(user);
    } catch (error) {
        res.status(500).json({ message: "Error creating user", error });
    }
});

export default router;
