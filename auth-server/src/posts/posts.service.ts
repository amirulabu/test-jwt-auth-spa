import { PrismaService } from './../prisma.service';
import { Injectable } from '@nestjs/common';
import { UpdatePostDto } from '../generated/nestjs-dto/update-post.dto';
import { CreatePostDto } from '../generated/nestjs-dto/create-post.dto';
import { Prisma } from '@prisma/client';
import { Post } from 'src/generated/nestjs-dto/post.entity';

@Injectable()
export class PostsService {
  constructor(private prisma: PrismaService) {}

  create(createPostDto: CreatePostDto, userId: number) {
    return this.prisma.post.create({
      data: { ...createPostDto, authorId: userId },
    });
  }

  async posts(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.UserWhereUniqueInput;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput;
  }): Promise<Post[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.post.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  post(id: number) {
    return this.prisma.post.findUnique({
      where: { id },
    });
  }

  update(id: number, updatePostDto: UpdatePostDto) {
    return this.prisma.post.update({
      data: updatePostDto,
      where: { id },
    });
  }

  remove(id: number) {
    return this.prisma.post.delete({
      where: { id },
    });
  }
}
