import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { EditUserDto } from './dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async editUser(userId: number, dto: EditUserDto) {
    const user = await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        ...dto,
      },
    });

    delete user.hash;

    return user;
  }

  async deleteUser(userId: number) {
    await this.prisma.history.deleteMany({
      where: {
        userId: userId,
      },
    });
    await this.prisma.stock.deleteMany({
      where: {
        userId: userId,
      },
    });
    await this.prisma.user.delete({
      where: {
        id: userId,
      },
    });
  }
}
