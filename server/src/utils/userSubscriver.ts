import { EventSubscriber, EntitySubscriberInterface, InsertEvent } from "typeorm";
import { User } from "../models/User";
import { Calendar } from "../models/Calendar";

@EventSubscriber()
export class UserSubscriber implements EntitySubscriberInterface<User> {
    listenTo() {
        return User;
    }

    async afterInsert(event: InsertEvent<User>) {
        console.log(`📌 User created: ${event.entity.id}`);

        const user = event.entity;

        // Используем event.manager для создания в той же транзакции
        const calendar = event.manager.create(Calendar, {
            name: user.fullName,
            description: "My personal calendar^^",
            owner: user
        });
        calendar.users = [user]; 

        await event.manager.save(calendar); // Сохраняем в рамках той же транзакции
        console.log(`✅ Personal calendar created for user: ${user.id}`);
    }
}
