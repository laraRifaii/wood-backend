import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateAdvantagesDto } from './advantages.dto';

const DEFAULT = {
  cta: 'Receive a consultation',
  image: '/images/advantages.png',
};

@Injectable()
export class AdvantagesService {
  constructor(private prisma: PrismaService) {}

  async get() {
    let section = await this.prisma.advantagesSection.findFirst({
      include: { items: { orderBy: { order: 'asc' } } },
    });
    if (!section) {
      section = await this.prisma.advantagesSection.create({
        data: {
          ...DEFAULT,
          items: {
            create: [
              { description: 'In-house carpentry production', order: 0 },
              { description: 'We only treat wood with environmentally friendly and safe products', order: 1 },
              { description: 'Prices from the manufacturer, no extra charges', order: 2 },
            ],
          },
        },
        include: { items: { orderBy: { order: 'asc' } } },
      });
    }
    return section;
  }

  async update(dto: UpdateAdvantagesDto) {
    let section = await this.prisma.advantagesSection.findFirst();
    if (!section) {
      section = await this.prisma.advantagesSection.create({
        data: { ...DEFAULT },
        include: { items: true },
      });
    }

    // Update section fields
    await this.prisma.advantagesSection.update({
      where: { id: section.id },
      data: {
        ...(dto.image && { image: dto.image }),
        ...(dto.cta && { cta: dto.cta }),
      },
    });

    // Replace items if provided
    if (dto.items) {
      await this.prisma.advantageItem.deleteMany({
        where: { advantagesSectionId: section.id },
      });
      await this.prisma.advantageItem.createMany({
        data: dto.items.map((item, i) => ({
          description: item.description,
          order: item.order ?? i,
          advantagesSectionId: section!.id,
        })),
      });
    }

    return this.get();
  }
}