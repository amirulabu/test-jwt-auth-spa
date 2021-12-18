import { JwtAuthGuard } from './../auth/jwt-auth.guard';
import { Prisma } from '@prisma/client';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UnprocessableEntityException,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from '../generated/nestjs-dto/create-user.dto';
import { UpdateUserDto } from '../generated/nestjs-dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    console.log(createUserDto);
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...userData } = await this.usersService.create(
        createUserDto,
      );
      return userData;
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        // The .code property can be accessed in a type-safe manner
        if (e.code === 'P2002') {
          throw new UnprocessableEntityException('Unique constraint failed');
        }
      }
      throw e;
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll() {
    const users = await this.usersService.users({});
    const filteredUsers = users.map((u) => {
      delete u.password;
      delete u.tokenVersion;
      return u;
    });
    return filteredUsers;
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const user = await this.usersService.user(+id);
    delete user.password;
    delete user.tokenVersion;
    return user;
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
