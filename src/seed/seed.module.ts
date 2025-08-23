import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { UserModule } from '../user/user.module';

@Module({
  imports: [UserModule],
  providers: [SeedService],
  exports: [SeedService],
})
export class SeedModule {}
