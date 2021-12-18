import { User } from '../generated/nestjs-dto/user.entity';
import { PrismaService } from './../prisma.service';
import { CreateUserDto } from '../generated/nestjs-dto/create-user.dto';
import { UpdateUserDto } from '../generated/nestjs-dto/update-user.dto';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { compare, hash } from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async user(id: number): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async users(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.UserWhereUniqueInput;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput;
  }): Promise<User[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.user.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    console.log(createUserDto);
    return this.prisma.user.create({
      data: {
        email: createUserDto.email,
        password: await hash(createUserDto.password, 10),
      },
    });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    return this.prisma.user.update({
      data: updateUserDto,
      where: { id },
    });
  }

  async remove(id: number) {
    return this.prisma.user.delete({
      where: { id },
    });
  }

  async validateCredentials(user: User, password: string): Promise<boolean> {
    return compare(password, user.password);
  }
}
