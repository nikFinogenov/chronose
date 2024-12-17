require("reflect-metadata");
const { DataSource } = require("typeorm");

const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres", // Замените на ваше имя пользователя
    password: "", // Замените на ваш пароль
    database: "calendar_db",
    synchronize: true, // Автоматически синхронизирует схему БД
    logging: false,
    entities: [require("./entity/User"), require("./entity/Event")],
});

module.exports = { AppDataSource };
