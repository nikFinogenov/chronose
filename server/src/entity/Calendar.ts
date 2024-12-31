import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { User } from "./User";

@Entity("calendars")
export class Event {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column("text")
    description: string;

    @Column("timestamp")
    date: Date;

    @ManyToOne(() => User, (user) => user.events, { nullable: false })
    user: User;
}
