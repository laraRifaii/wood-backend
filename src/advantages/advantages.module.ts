import { Module } from '@nestjs/common';
import { AdvantagesController } from './advantages.controller';
import { AdvantagesService } from './advantages.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [AdvantagesController],
  providers: [AdvantagesService],
})
export class AdvantagesModule {}
