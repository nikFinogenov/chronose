import { Injectable } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { Event } from './entities/event.entity';

@Injectable()
export class EventsService {
  private _events: Event[] = [];

  create(createEventDto: CreateEventDto) {
    const id = this._getRandomInt();
    const user_id = createEventDto.user_id;
    const event = new Event(id, user_id);
    this._events.push(event);
    return event;
  }

  findAll() {
    return this._events;
  }

  findOne(id: number) {
    return this._events.find(event => event.id === id);
  }

  update(id: number, updateEventDto: UpdateEventDto) {
    const index = this._events.findIndex(event => event.id === id);
    if (index === -1) {
      return;
    }

    const { user_id } = this._events[index];
    this._events[index] = new Event(id, updateEventDto.user_id ?? user_id);
    return this._events[index];
  }

  remove(id: number) {
    this._events = this._events.filter(event => event.id !== id);
  }

  private _getRandomInt() {
    return Math.floor(Math.random() * 100);
  }
}
