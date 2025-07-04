import { Injectable, Logger } from '@nestjs/common';
import { UserService } from '../user/user.service';

@Injectable()
export class SeedService {
  private readonly logger = new Logger(SeedService.name);

  constructor(private userService: UserService) {}

  async seedDatabase() {
    try {
      this.logger.log('Starting database seeding...');
      
      // Create default admin user
      const admin = await this.userService.createDefaultAdmin();
      this.logger.log(`Default admin user created/verified: ${admin.email}`);
      
      this.logger.log('Database seeding completed successfully');
    } catch (error) {
      this.logger.error('Error during database seeding:', error);
      throw error;
    }
  }
} 