import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ServicesService } from './services.service';
import { CreateServiceDto, UpdateServiceDto } from './services.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@ApiTags('Services')
@Controller('services')
export class ServicesController {
  constructor(private servicesService: ServicesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all services (public)' })
  findAll() { return this.servicesService.findAll(); }

  @Get(':id')
  @ApiOperation({ summary: 'Get single service (public)' })
  findOne(@Param('id') id: string) { return this.servicesService.findOne(id); }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create service (admin)' })
  create(@Body() dto: CreateServiceDto) { return this.servicesService.create(dto); }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update service (admin)' })
  update(@Param('id') id: string, @Body() dto: UpdateServiceDto) {
    return this.servicesService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete service (admin)' })
  remove(@Param('id') id: string) { return this.servicesService.remove(id); }
}
