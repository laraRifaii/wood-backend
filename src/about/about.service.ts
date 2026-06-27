import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateAboutDto } from './about.dto';

const DEFAULT = {
  brandName: 'BIO CWT',
  description: 'We manufacture solid wood products according to individual drawings.',
  image1: '/images/about1.png',
  image2: '/images/about2.png',
  image3: '/images/about3.png',
};

@Injectable()
export class AboutService {
  constructor(private prisma: PrismaService) {}

  async get() {
    let about = await this.prisma.aboutSection.findFirst();
    if (!about) about = await this.prisma.aboutSection.create({ data: DEFAULT });
    return about;
  }

  async update(dto: UpdateAboutDto) {
    let about = await this.prisma.aboutSection.findFirst();
    if (!about) return this.prisma.aboutSection.create({ data: { ...DEFAULT, ...dto } });
    return this.prisma.aboutSection.update({ where: { id: about.id }, data: dto });
  }
}
