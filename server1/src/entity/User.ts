import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToMany } from "typeorm";
import { Event } from "./Event";

@Entity("users")
export class User extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    email: string;

    // Define the reverse relationship to Event
    @OneToMany(() => Event, (event) => event.user)
    events: Event[];
}
