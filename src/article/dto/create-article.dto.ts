import {
  IsNotEmpty,
  IsString,
  IsObject,
  ValidateNested,
  IsOptional,
  IsBoolean,
  IsArray,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ArticleImageDto {
  @ApiProperty({
    example: 'Getting started with NestJS tutorial',
    description: 'Alt text for the image',
  })
  @IsNotEmpty()
  @IsString()
  alt: string;

  @ApiProperty({
    example: 'https://example.com/images/nestjs-tutorial.jpg',
    description: 'Image source URL',
  })
  @IsNotEmpty()
  @IsString()
  src: string;
}

export class CreateArticleDto {
  @ApiProperty({
    example: 'Getting Started with NestJS',
    description: 'Article title',
  })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({
    example: 'NestJS is a progressive Node.js framework...',
    description: 'Article content',
  })
  @IsNotEmpty()
  @IsString()
  content: string;

  @ApiPropertyOptional({
    example: 'Learn how to build scalable server-side applications with NestJS...',
    description: 'Article excerpt for previews',
  })
  @IsOptional()
  @IsString()
  excerpt?: string;

  @ApiProperty({
    type: ArticleImageDto,
    description: 'Article image with alt text and source URL',
  })
  @IsNotEmpty()
  @IsObject()
  @ValidateNested()
  @Type(() => ArticleImageDto)
  image: ArticleImageDto;

  @ApiPropertyOptional({
    example: false,
    description: 'Whether the article is published',
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  published?: boolean;

  @ApiPropertyOptional({
    example: 'Learn NestJS framework, build scalable APIs, TypeScript development',
    description: 'SEO meta description',
  })
  @IsOptional()
  @IsString()
  metaDescription?: string;

  @ApiPropertyOptional({
    example: ['nestjs', 'typescript', 'nodejs', 'backend'],
    description: 'Article tags',
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];
}
