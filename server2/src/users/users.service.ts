import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  private _users: User[] = [];

  create(createUserDto: CreateUserDto) {
    const id = this._getRandomInt();
    const user = new User(id, createUserDto.login);
    this._users.push(user);
    return user;
  }

  findAll() {
    return this._users;
  }

  findOne(id: number) {
    return this._users.find(user => user.id === id);
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    const index = this._users.findIndex(user => user.id === id);

    if (index === -1) {
      return;
    }

    const { login } = updateUserDto;
    const user = this._users[index];
    this._users[index] = new User(id, login ?? user.login);
    return this._users[index];
  }

  remove(id: number) {
    this._users = this._users.filter(user => user.id !== id);
  }

  private _getRandomInt() {
    return Math.floor(Math.random() * 100);
  }
}
