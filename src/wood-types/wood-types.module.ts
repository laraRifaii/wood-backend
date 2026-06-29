import { Module } from '@nestjs/common';
import { WoodTypesService } from './wood-types.service';
import { WoodTypesController } from './wood-types.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { UploadService } from '../common/upload.service';

@Module({
  imports: [PrismaModule],

  providers: [WoodTypesService,UploadService],
  controllers: [WoodTypesController],
})
export class WoodTypesModule {}
