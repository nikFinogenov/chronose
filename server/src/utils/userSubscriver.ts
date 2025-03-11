import { EventSubscriber, EntitySubscriberInterface, InsertEvent } from "typeorm";
import { User } from "../models/User";
import { Calendar } from "../models/Calendar";
import { seedLocalEventsForCountry } from "../database/data-source";

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

        if (user.country) {
            await seedLocalEventsForCountry(user.country);

            const localCalendar = await event.manager.findOne(Calendar, {
                where: {name: `Holidays in ${user.country}`},
                relations: ['users'],
            })
            // localCalendar.
            if (localCalendar.users.some(u => u.id === user.id)) {
				return;
			}

			localCalendar.users.push(user);
			// await localCalendar.save();
            await event.manager.save(localCalendar);
        }


        // const localCalendar = await Calendar.findOne({
        //     where: { id: calendarId },
        //     relations: ['owner'],
        // });
    }
}
