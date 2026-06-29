import { Module } from '@nestjs/common';
import { HeroService } from './hero.service';
import { HeroController } from './hero.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { UploadService } from '../common/upload.service';

@Module({
  imports: [PrismaModule],
  providers: [HeroService,UploadService],
  controllers: [HeroController],
})
export class HeroModule {}
