import { Module } from '@nestjs/common';
import { WoodTypesService } from './wood-types.service';
import { WoodTypesController } from './wood-types.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],

  providers: [WoodTypesService],
  controllers: [WoodTypesController],
})
export class WoodTypesModule {}
