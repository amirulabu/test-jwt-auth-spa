import { PrismaService } from './../prisma.service';
import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';

@Module({
  controllers: [PostsController],
  providers: [PrismaService, PostsService],
})
export class PostsModule {}
