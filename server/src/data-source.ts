import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "./entity/User";
import { Event } from "./entity/Event";
import { Calendar } from "./entity/Calendar";
import { Client } from "pg";  // PostgreSQL client

export const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "", 
    database: "calendar_db",
    synchronize: true,
    logging: false,
    entities: [Event, Calendar, User],
    migrations: [],
    subscribers: [],
});

export const createDatabaseIfNotExists = async () => {
    const client = new Client({
        host: "localhost",
        port: 5432,
        user: "postgres",  // Replace with your username
        password: "",  // Replace with your password
        database: "postgres",  // Connect to the default database to create the new one
    });

    try {
        await client.connect();

        const result = await client.query(
            `SELECT 1 FROM pg_database WHERE datname = 'calendar_db'`
        );

        if (result.rows.length === 0) {
            await client.query(`CREATE DATABASE calendar_db`);
            console.log("Database 'calendar_db' has been created!");
        } else {
            console.log("Database 'calendar_db' already exists.");
        }
    } catch (error) {
        console.error("Error while checking/creating the database:", error);
    } finally {
        await client.end();
    }
};
