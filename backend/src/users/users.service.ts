import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {
  private users = [
    {
      id: 1,
      name: 'Ahmed',
    },
    {
      id: 2,
      name: 'Ali',
    },
  ];
  getUsers() {
    return this.users;
  }
  getUserById(id: number) {
    return this.users.find((user) => user.id === id);
  }
  createUser(name: string) {
    const newUser = {
      id: this.users.length + 1,
      name,
    };
    this.users.push(newUser);
    return newUser;
  }
}
