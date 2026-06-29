import { Module } from '@nestjs/common';
import { AdvantagesController } from './advantages.controller';
import { AdvantagesService } from './advantages.service';
import { PrismaModule } from '../prisma/prisma.module';
import { UploadService } from '../common/upload.service';

@Module({
  imports: [PrismaModule],
  controllers: [AdvantagesController],
  providers: [AdvantagesService,UploadService],
})
export class AdvantagesModule {}
