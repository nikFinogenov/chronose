import express from "express";
import { AppDataSource, createDatabaseIfNotExists } from "./src/data-source";
import userRoutes from "./src/routes/user.routes";
import eventRoutes from "./src/routes/event.routes";

const app = express();
const PORT = 3000;

app.use(express.json());

// Connect routes
app.use("/api/users", userRoutes);
app.use("/api/events", eventRoutes);

// Create the database if it doesn't exist, then initialize the data source and start the server
createDatabaseIfNotExists()
    .then(() => {
        AppDataSource.initialize()
            .then(() => {
                console.log("Data Source has been initialized!");

                app.listen(PORT, () => {
                    console.log(`Server is running on http://localhost:${PORT}`);
                });
            })
            .catch((error) => {
                console.error("Error during Data Source initialization:", error);
            });
    })
    .catch((error) => {
        console.error("Error during database creation:", error);
    });
