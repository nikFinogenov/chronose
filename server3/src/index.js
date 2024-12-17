require("reflect-metadata");
const express = require("express");
const { AppDataSource } = require("./data-source");

const app = express();
app.use(express.json());

const userRoutes = require("./routes/user.routes");
const eventRoutes = require("./routes/event.routes");

app.use("/api/users", userRoutes);
app.use("/api/events", eventRoutes);

AppDataSource.initialize()
    .then(() => {
        console.log("Database connected");
        app.listen(3000, () => {
            console.log("Server is running on http://localhost:3000");
        });
    })
    .catch((err) => console.error("Error: ", err));
