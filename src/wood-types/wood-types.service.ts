import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateWoodTypeDto, UpdateWoodTypeDto, ReorderImagesDto } from './wood-types.dto';

@Injectable()
export class WoodTypesService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.woodType.findMany({
      orderBy: { order: 'asc' },
      include: { images: { orderBy: { order: 'asc' } } },
    });
  }

  async findOne(id: string) {
    const wood = await this.prisma.woodType.findUnique({
      where: { id },
      include: { images: { orderBy: { order: 'asc' } } },
    });
    if (!wood) throw new NotFoundException('Wood type not found');
    return wood;
  }

  create(dto: CreateWoodTypeDto) {
    return this.prisma.woodType.create({ data: dto, include: { images: true } });
  }

  async update(id: string, dto: UpdateWoodTypeDto) {
    await this.findOne(id);
    return this.prisma.woodType.update({ where: { id }, data: dto, include: { images: true } });
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.woodType.delete({ where: { id } });
    return { message: 'Wood type deleted successfully' };
  }

  async addImage(woodTypeId: string, url: string) {
    await this.findOne(woodTypeId);
    const count = await this.prisma.woodTypeImage.count({ where: { woodTypeId } });
    return this.prisma.woodTypeImage.create({
      data: { url, woodTypeId, order: count },
    });
  }

  async reorderImages(woodTypeId: string, dto: ReorderImagesDto) {
    await Promise.all(
      dto.items.map(({ id, order }) =>
        this.prisma.woodTypeImage.update({ where: { id }, data: { order } }),
      ),
    );
    return this.findOne(woodTypeId);
  }

  async deleteImage(imageId: string) {
    await this.prisma.woodTypeImage.delete({ where: { id: imageId } });
    return { message: 'Image deleted successfully' };
  }
}
