import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Query,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage, memoryStorage } from 'multer';
import { extname } from 'path';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiConsumes,
  ApiQuery,
} from '@nestjs/swagger';
import { GalleryService } from './gallery.service';
import { UpdateGalleryImageDto, ReorderGalleryDto } from './gallery.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { UploadService } from '../common/upload.service';

@ApiTags('Gallery')
@Controller('gallery')
export class GalleryController {
  constructor(
    private galleryService: GalleryService,
    private uploadService: UploadService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get all gallery images (public)' })
  findAll() {
    return this.galleryService.findAll();
  }

  @Post('upload')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Upload gallery image (admin)' })
  @ApiQuery({ name: 'alt', required: false })
  @ApiQuery({ name: 'category', required: false })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
    }),
  )
 async upload(
    @UploadedFile() file: Express.Multer.File,
    @Query('alt') alt?: string,
    @Query('category') category?: string,
  ) {
      const url = await this.uploadService.uploadImage(file);
      return this.galleryService.uploadWithUrl(url, alt || file.originalname, category);
  }

  @Patch('reorder')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Reorder gallery images (admin)' })
  reorder(@Body() dto: ReorderGalleryDto) {
    return this.galleryService.reorder(dto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update gallery image metadata (admin)' })
  update(@Param('id') id: string, @Body() dto: UpdateGalleryImageDto) {
    return this.galleryService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete gallery image (admin)' })
  remove(@Param('id') id: string) {
    return this.galleryService.remove(id);
  }
}
