import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  Inject,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { User } from './entities/user.entity';
import { DataService } from '../shared/data.service';

@Injectable()
export class UsersService {
  constructor(@Inject(DataService) private readonly dataService: DataService) {}

  findAll(): Omit<User, 'password'>[] {
    return this.dataService.users.map((user) => this.excludePassword(user));
  }

  findOne(id: string): Omit<User, 'password'> {
    const user = this.dataService.users.find((user) => user.id === id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return this.excludePassword(user);
  }

  create(createUserDto: CreateUserDto): Omit<User, 'password'> {
    const user: User = {
      id: this.generateUUID(),
      login: createUserDto.login,
      password: createUserDto.password,
      version: 1,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    this.dataService.users.push(user);
    return this.excludePassword(user);
  }

  updatePassword(
    id: string,
    updatePasswordDto: UpdatePasswordDto,
  ): Omit<User, 'password'> {
    const userIndex = this.dataService.users.findIndex(
      (user) => user.id === id,
    );

    if (userIndex === -1) {
      throw new NotFoundException('User not found');
    }

    if (
      this.dataService.users[userIndex].password !==
      updatePasswordDto.oldPassword
    ) {
      throw new ForbiddenException('Old password is incorrect');
    }

    const updatedUser = Object.assign(this.dataService.users[userIndex], {
      password: updatePasswordDto.newPassword,
      version: this.dataService.users[userIndex].version + 1,
      updatedAt: Date.now(),
    });

    this.dataService.users[userIndex] = updatedUser;
    return this.excludePassword(updatedUser);
  }

  remove(id: string): void {
    const userIndex = this.dataService.users.findIndex(
      (user) => user.id === id,
    );

    if (userIndex === -1) {
      throw new NotFoundException('User not found');
    }

    this.dataService.users.splice(userIndex, 1);
  }

  private excludePassword(user: User): Omit<User, 'password'> {
    const userWithoutPassword: Omit<User, 'password'> = {
      id: user.id,
      login: user.login,
      version: user.version,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
    return userWithoutPassword;
  }

  private generateUUID(): string {
    return crypto.randomUUID();
  }
}
