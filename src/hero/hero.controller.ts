import {
  Controller,
  Get,
  Patch,
  Body,
  UseGuards,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiConsumes,
} from '@nestjs/swagger';
import { HeroService } from './hero.service';
import { UpdateHeroDto } from './hero.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage, memoryStorage } from 'multer';
import { extname } from 'path';
import { UploadService } from '../common/upload.service';

@ApiTags('Hero Section')
@Controller('hero')
export class HeroController {
  constructor(
    private heroService: HeroService,
    private uploadService: UploadService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get hero section content (public)' })
  get() {
    return this.heroService.get();
  }

  @Patch()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update hero section (admin only)' })
  update(@Body() dto: UpdateHeroDto) {
    return this.heroService.update(dto);
  }

  @Post('upload')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Upload hero image (admin)' })
  @UseInterceptors(FileInterceptor('file', { storage: memoryStorage() }))
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    const url = await this.uploadService.uploadImage(file);
    return { url };
  }
 
}
