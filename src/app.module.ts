import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AboutModule } from './about/about.module';
import { GalleryModule } from './gallery/gallery.module';
import { HeroModule } from './hero/hero.module';
import { ServicesModule } from './services/services.module';
import { WoodTypesModule } from './wood-types/wood-types.module';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),
    PrismaModule,
    AuthModule,
    HeroModule,
    WoodTypesModule,
    ServicesModule,
    GalleryModule,
    AboutModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
