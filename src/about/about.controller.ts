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
import { AboutService } from './about.service';
import { UpdateAboutDto } from './about.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage, memoryStorage } from 'multer';
import { extname } from 'path';
import { UploadService } from '../common/upload.service';

@ApiTags('About Section')
@Controller('about')
export class AboutController {
  constructor(
    private aboutService: AboutService,
    private uploadService: UploadService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get about section (public)' })
  get() {
    return this.aboutService.get();
  }

  @Patch()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update about section (admin)' })
  update(@Body() dto: UpdateAboutDto) {
    return this.aboutService.update(dto);
  }

  @Post('upload')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Upload about image (admin)' })
  @UseInterceptors(FileInterceptor('file', { storage: memoryStorage() }))
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    const url = await this.uploadService.uploadImage(file);
    return { url };
  }
}
