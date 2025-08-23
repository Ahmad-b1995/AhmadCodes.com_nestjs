import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MediaService } from './media.service';
import { MediaController } from './media.controller';
import { MediaConfigService } from './media.config';

@Module({
  imports: [ConfigModule],
  controllers: [MediaController],
  providers: [MediaService, MediaConfigService],
  exports: [MediaService],
})
export class MediaModule {}
