import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateContactDto } from './contact.dto';

@Injectable()
export class ContactService {
  constructor(private prisma: PrismaService) {}

  async remove(id: string) {
    await this.prisma.contactMessage.delete({ where: { id } });
    return { message: 'Deleted successfully' };
  }
  async submit(dto: CreateContactDto) {
    const message = await this.prisma.contactMessage.create({ data: dto });
    return {
      success: true,
      message: 'Your message has been received. We will contact you soon.',
    };
  }

  findAll() {
    return this.prisma.contactMessage.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }
}
