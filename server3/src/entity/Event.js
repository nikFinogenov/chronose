const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
    name: "Event",
    tableName: "event",
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true,
        },
        title: {
            type: "varchar",
        },
        description: {
            type: "text",
        },
        date: {
            type: "timestamp",
        },
    },
    relations: {
        user: {
            target: "User",
            type: "many-to-one",
            joinColumn: true,
            nullable: false,
        },
    },
});
