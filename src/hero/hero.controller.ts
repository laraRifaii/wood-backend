import { Controller, Get, Patch, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { HeroService } from './hero.service';
import { UpdateHeroDto } from './hero.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@ApiTags('Hero Section')
@Controller('hero')
export class HeroController {
  constructor(private heroService: HeroService) {}

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
}
