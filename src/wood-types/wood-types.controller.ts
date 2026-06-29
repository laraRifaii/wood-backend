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
import { WoodTypesService } from './wood-types.service';
import {
  CreateWoodTypeDto,
  UpdateWoodTypeDto,
  ReorderImagesDto,
} from './wood-types.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { UploadService } from '../common/upload.service';

@ApiTags('Wood Types / Products')
@Controller('wood-types')
export class WoodTypesController {
  constructor(
    private woodTypesService: WoodTypesService,
    private uploadService: UploadService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get all wood types (public)' })
  findAll() {
    return this.woodTypesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get single wood type (public)' })
  findOne(@Param('id') id: string) {
    return this.woodTypesService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create wood type (admin)' })
  create(@Body() dto: CreateWoodTypeDto) {
    return this.woodTypesService.create(dto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update wood type (admin)' })
  update(@Param('id') id: string, @Body() dto: UpdateWoodTypeDto) {
    return this.woodTypesService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete wood type (admin)' })
  remove(@Param('id') id: string) {
    return this.woodTypesService.remove(id);
  }

  @Post(':id/images')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Upload image for wood type (admin)' })
  @UseInterceptors(FileInterceptor('file', { storage: memoryStorage() }))
  async uploadImage(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const url = await this.uploadService.uploadImage(file);
    return this.woodTypesService.addImage(id, url);
  }

  @Patch(':id/images/reorder')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Reorder images for wood type (admin)' })
  reorderImages(@Param('id') id: string, @Body() dto: ReorderImagesDto) {
    return this.woodTypesService.reorderImages(id, dto);
  }

  @Delete('images/:imageId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a wood type image (admin)' })
  deleteImage(@Param('imageId') imageId: string) {
    return this.woodTypesService.deleteImage(imageId);
  }
}
