const { Router } = require("express");
const router = Router();
const { AppDataSource } = require("../data-source");
const User = require("../entity/User");

const userRepository = AppDataSource.getRepository("User");

router.get("/", async (req, res) => {
    const users = await userRepository.find({ relations: ["events"] });
    res.json(users);
});

router.post("/", async (req, res) => {
    const { name, email } = req.body;

    const user = userRepository.create({ name, email });
    await userRepository.save(user);

    res.status(201).json(user);
});

module.exports = router;
