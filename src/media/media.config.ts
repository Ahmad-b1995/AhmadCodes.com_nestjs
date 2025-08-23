import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  S3Client,
  HeadBucketCommand,
  CreateBucketCommand,
} from '@aws-sdk/client-s3';

@Injectable()
export class MediaConfigService implements OnModuleInit {
  private readonly logger = new Logger(MediaConfigService.name);
  private readonly s3Client: S3Client;
  private readonly bucketName: string;
  private readonly region: string;
  private readonly endpoint: string;

  constructor(private configService: ConfigService) {
    this.bucketName = this.configService.getOrThrow<string>('DO_SPACES_BUCKET');
    this.region = this.configService.getOrThrow<string>('DO_SPACES_REGION');
    this.endpoint = `https://${this.region}.digitaloceanspaces.com`;

    this.s3Client = new S3Client({
      endpoint: this.endpoint,
      region: this.region,
      credentials: {
        accessKeyId: this.configService.getOrThrow<string>('DO_SPACES_KEY'),
        secretAccessKey: this.configService.getOrThrow<string>('DO_SPACES_SECRET'),
      },
      forcePathStyle: false, // DigitalOcean Spaces uses virtual hosted-style
    });

    this.logger.log(
      `Spaces service initialized for bucket: ${this.bucketName}`,
    );
  }

  async onModuleInit() {
    // await this.ensureBucketExists();
  }

  private async ensureBucketExists(): Promise<void> {
    try {
      // Check if bucket exists
      await this.s3Client.send(
        new HeadBucketCommand({ Bucket: this.bucketName }),
      );
      this.logger.log(`Bucket '${this.bucketName}' already exists`);
    } catch (error) {
      if (
        error.name === 'NotFound' ||
        error.$metadata?.httpStatusCode === 404
      ) {
        // Bucket doesn't exist, create it
        try {
          await this.s3Client.send(
            new CreateBucketCommand({ Bucket: this.bucketName }),
          );
          this.logger.log(`Created bucket '${this.bucketName}'`);
        } catch (createError) {
          this.logger.error(
            `Failed to create bucket '${this.bucketName}':`,
            createError,
          );
        }
      } else {
        // this.logger.error(`Error checking bucket '${this.bucketName}':`, error);
        this.logger.error(`Error checking bucket '${this.bucketName}':`, {
          name: error.name,
          message: error.message,
          statusCode: error.$metadata?.httpStatusCode,
          requestId: error.$metadata?.requestId,
          region: this.configService.get<string>('DO_SPACES_REGION'),
          endpoint: `https://${this.configService.get<string>('DO_SPACES_REGION')}.digitaloceanspaces.com`,
          bucketName: this.bucketName,
          hasCredentials: !!(this.configService.get<string>('DO_SPACES_KEY') && this.configService.get<string>('DO_SPACES_SECRET'))
        });
      }
    }
  }
}
