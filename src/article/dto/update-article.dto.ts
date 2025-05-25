import { PartialType } from '@nestjs/mapped-types';
import { CreateArticleDto } from './create-article.dto';
import { IsNotEmpty, IsInt } from 'class-validator';

export class UpdateArticleDto extends PartialType(CreateArticleDto) {
  @IsNotEmpty()
  @IsInt()
  id: number;
}
