import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Article } from './entities/article.entity';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(Article)
    private readonly articleRepository: Repository<Article>,
  ) {}

  async create(newArticle: CreateArticleDto): Promise<Article> {
    const article = this.articleRepository.create({
      title: newArticle.title,
      content: newArticle.content,
      author: newArticle.author,
    });
    return this.articleRepository.save(article);
  }

  async findAll(): Promise<Article[]> {
    return this.articleRepository.find();
  }

  async findOne(id: number): Promise<Article> {
    const article = await this.articleRepository.findOne({ where: { id } });
    if (!article) {
      throw new NotFoundException(`Article with ID ${id} not found.`);
    }
    return article;
  }

  async update(id: number, updateArticle: UpdateArticleDto): Promise<Article> {
    const article = await this.findOne(id);
    Object.assign(article, updateArticle);
    return this.articleRepository.save(article);
  }
  async remove(id: number): Promise<void> {
    const article = await this.findOne(id);
    await this.articleRepository.remove(article);
  }
}
