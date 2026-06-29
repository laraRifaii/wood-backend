import { Module } from '@nestjs/common';
import { AboutService } from './about.service';
import { AboutController } from './about.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { UploadService } from '../common/upload.service';

@Module({
  imports: [PrismaModule],
  providers: [AboutService,UploadService],
  controllers: [AboutController],
})
export class AboutModule {}
