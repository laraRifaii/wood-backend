import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateGalleryImageDto, ReorderGalleryDto } from './gallery.dto';

@Injectable()
export class GalleryService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.galleryImage.findMany({ orderBy: { order: 'asc' } });
  }

  async findOne(id: string) {
    const image = await this.prisma.galleryImage.findUnique({ where: { id } });
    if (!image) throw new NotFoundException('Image not found');
    return image;
  }

  async upload(file: Express.Multer.File, alt?: string, category?: string) {
    const count = await this.prisma.galleryImage.count();
    return this.prisma.galleryImage.create({
      data: {
        src: `/uploads/gallery/${file.filename}`,
        alt: alt || file.originalname,
        category: category || 'Uncategorized',
        order: count,
      },
    });
  }
  async uploadWithUrl(url: string, alt: string, category?: string) {
    const count = await this.prisma.galleryImage.count();
    return this.prisma.galleryImage.create({
      data: {
        src: url,
        alt,
        category: category || 'Uncategorized',
        order: count,
      },
    });
  }
  async update(id: string, dto: UpdateGalleryImageDto) {
    await this.findOne(id);
    return this.prisma.galleryImage.update({ where: { id }, data: dto });
  }

  async reorder(dto: ReorderGalleryDto) {
    await Promise.all(
      dto.items.map(({ id, order }) =>
        this.prisma.galleryImage.update({ where: { id }, data: { order } }),
      ),
    );
    return this.findAll();
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.galleryImage.delete({ where: { id } });
    return { message: 'Image deleted successfully' };
  }
}
