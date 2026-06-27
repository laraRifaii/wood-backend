import { Controller, Get, Patch, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AboutService } from './about.service';
import { UpdateAboutDto } from './about.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@ApiTags('About Section')
@Controller('about')
export class AboutController {
  constructor(private aboutService: AboutService) {}

  @Get()
  @ApiOperation({ summary: 'Get about section (public)' })
  get() { return this.aboutService.get(); }

  @Patch()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update about section (admin)' })
  update(@Body() dto: UpdateAboutDto) { return this.aboutService.update(dto); }
}
