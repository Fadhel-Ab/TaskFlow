import { Injectable, NotFoundException } from '@nestjs/common';

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
    const user = this.users.find((user) => user.id === id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
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
