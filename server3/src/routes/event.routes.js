const { Router } = require("express");
const router = Router();
const { AppDataSource } = require("../data-source");
const Event = require("../entity/Event");
const User = require("../entity/User");

const eventRepository = AppDataSource.getRepository("Event");
const userRepository = AppDataSource.getRepository("User");

// Получить все события
router.get("/", async (req, res) => {
    try {
        const events = await eventRepository.find({ relations: ["user"] });
        res.json(events);
    } catch (error) {
        res.status(500).json({ message: "Error fetching events", error });
    }
});

// Получить событие по ID
router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const event = await eventRepository.findOne({
            where: { id },
            relations: ["user"],
        });

        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }

        res.json(event);
    } catch (error) {
        res.status(500).json({ message: "Error fetching event", error });
    }
});

// Создать новое событие
router.post("/", async (req, res) => {
    try {
        const { title, description, date, userId } = req.body;

        // Проверяем существование пользователя
        const user = await userRepository.findOneBy({ id: userId });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Создаем событие
        const event = eventRepository.create({ title, description, date, user });
        await eventRepository.save(event);

        res.status(201).json(event);
    } catch (error) {
        res.status(500).json({ message: "Error creating event", error });
    }
});

// Обновить событие по ID
router.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, date } = req.body;

        let event = await eventRepository.findOneBy({ id });

        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }

        // Обновляем поля события
        event.title = title || event.title;
        event.description = description || event.description;
        event.date = date || event.date;

        await eventRepository.save(event);
        res.json(event);
    } catch (error) {
        res.status(500).json({ message: "Error updating event", error });
    }
});

// Удалить событие по ID
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const result = await eventRepository.delete(id);

        if (result.affected === 0) {
            return res.status(404).json({ message: "Event not found" });
        }

        res.json({ message: "Event deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting event", error });
    }
});

module.exports = router;
