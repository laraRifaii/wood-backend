import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateHeroDto } from './hero.dto';

const DEFAULT_HERO = {
  title: 'SOLID\nWOOD\nPRODUCTS',
  subtitle: 'Handcrafted furniture and woodwork from premium hardwoods.',
  ctaText: 'View Our Work',
  ctaLink: '/gallery',
  backgroundImage: '/images/hero-bg.jpg',
};

@Injectable()
export class HeroService {
  constructor(private prisma: PrismaService) {}

  async get() {
    let hero = await this.prisma.hero.findFirst();
    if (!hero) {
      hero = await this.prisma.hero.create({ data: { ...DEFAULT_HERO } });
    }
    return hero;
  }

  async update(dto: UpdateHeroDto) {
    let hero = await this.prisma.hero.findFirst();
    if (!hero) {
      return this.prisma.hero.create({ data: { ...DEFAULT_HERO, ...dto } });
    }
    return this.prisma.hero.update({ where: { id: hero.id }, data: dto });
  }
}
