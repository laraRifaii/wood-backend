import {
  Controller,
  Get,
  Patch,
  Post,
  Body,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage, memoryStorage } from 'multer';
import { extname } from 'path';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiConsumes,
} from '@nestjs/swagger';
import { AdvantagesService } from './advantages.service';
import { UpdateAdvantagesDto } from './advantages.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { UploadService } from '../common/upload.service';

@ApiTags('Advantages Section')
@Controller('advantages')
export class AdvantagesController {
  constructor(
    private advantagesService: AdvantagesService,
    private uploadService: UploadService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get advantages section (public)' })
  get() {
    return this.advantagesService.get();
  }

  @Patch()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update advantages section (admin)' })
  update(@Body() dto: UpdateAdvantagesDto) {
    return this.advantagesService.update(dto);
  }

  @Post('upload')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Upload advantages image (admin)' })
  @UseInterceptors(FileInterceptor('file', { storage: memoryStorage() }))
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    const url = await this.uploadService.uploadImage(file);
    return { url };
  }
}
