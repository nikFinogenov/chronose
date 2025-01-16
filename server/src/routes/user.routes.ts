import { Router, Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { User } from "../entity/User";

const router = Router();
const userRepository = AppDataSource.getRepository(User);

// Получить всех пользователей
router.get("/", async (req: Request, res: Response) => {
    res.status(201).json(`user:negr`)
    // const users = await userRepository.find({ relations: ["events"] });
    // res.json(users);
});

// Создать нового пользователя
router.post("/", async (req: Request, res: Response) => {
    // const { name, email } = req.body;

    // const user = userRepository.create({ name, email });
    // await userRepository.save(user);

    // res.status(201).json(user);
});

export default router;
