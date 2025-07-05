import { IsNotEmpty, IsString, IsObject, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class ArticleImageDto {
  @ApiProperty({ example: 'Getting started with NestJS tutorial', description: 'Alt text for the image' })
  @IsNotEmpty()
  @IsString()
  alt: string;

  @ApiProperty({ example: 'https://example.com/images/nestjs-tutorial.jpg', description: 'Image source URL' })
  @IsNotEmpty()
  @IsString()
  src: string;
}

export class CreateArticleDto {
  @ApiProperty({ example: 'Getting Started with NestJS', description: 'Article title' })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({ example: 'NestJS is a progressive Node.js framework...', description: 'Article content' })
  @IsNotEmpty()
  @IsString()
  content: string;

  @ApiProperty({ type: ArticleImageDto, description: 'Article image with alt text and source URL' })
  @IsNotEmpty()
  @IsObject()
  @ValidateNested()
  @Type(() => ArticleImageDto)
  image: ArticleImageDto;
}
