import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { User, UserWithoutPassword } from './entities/user.entity';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<UserWithoutPassword[]> {
    const users = await this.prisma.user.findMany({
      select: this.getUserWithoutPasswordSelect(),
    });
    return users.map((user) => this.serializeUser(user));
  }

  async findOne(id: string): Promise<UserWithoutPassword> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: this.getUserWithoutPasswordSelect(),
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }
    return this.serializeUser(user);
  }

  async create(createUserDto: CreateUserDto): Promise<UserWithoutPassword> {
    const existingUser = await this.prisma.user.findUnique({
      where: { login: createUserDto.login },
    });

    if (existingUser) {
      return this.serializeUser(existingUser);
    }

    const currentTime = Date.now();

    const user = await this.prisma.user.create({
      data: {
        login: createUserDto.login,
        password: createUserDto.password,
        version: 1,
        createdAt: currentTime,
        updatedAt: currentTime,
      },
      select: this.getUserWithoutPasswordSelect(),
    });

    return this.serializeUser(user);
  }

  async updatePassword(
    id: string,
    updatePasswordDto: UpdatePasswordDto,
  ): Promise<UserWithoutPassword> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.password !== updatePasswordDto.oldPassword) {
      throw new ForbiddenException('Old password is incorrect');
    }

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: {
        password: updatePasswordDto.newPassword,
        version: user.version + 1,
        updatedAt: Date.now(),
      },
      select: this.getUserWithoutPasswordSelect(),
    });

    return this.serializeUser(updatedUser);
  }

  async remove(id: string): Promise<void> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.prisma.user.delete({
      where: { id },
    });
  }

  private getUserWithoutPasswordSelect() {
    return {
      id: true,
      login: true,
      version: true,
      createdAt: true,
      updatedAt: true,
    };
  }

  private serializeUser(user: Omit<User, 'password'>): UserWithoutPassword {
    return {
      id: user.id,
      login: user.login,
      version: user.version,
      createdAt: Number(user.createdAt),
      updatedAt: Number(user.updatedAt),
    };
  }
}
