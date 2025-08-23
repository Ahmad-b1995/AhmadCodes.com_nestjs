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
      excerpt: newArticle.excerpt,
      image: newArticle.image,
      published: newArticle.published || false,
      metaDescription: newArticle.metaDescription,
      tags: newArticle.tags,
    });
    return this.articleRepository.save(article);
  }

  async findAll(): Promise<Article[]> {
    const articles = await this.articleRepository.find({
      where: { published: true },
      order: { publishedAt: 'DESC' },
    });
    
    // Generate slugs for articles that don't have them
    for (const article of articles) {
      if (!article.slug) {
        article.slug = this.generateSlug(article.title, article.id);
        await this.articleRepository.save(article);
      }
    }
    
    return articles;
  }

  private generateSlug(title: string, id: number): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim() + '-' + id;
  }

  async findAllForAdmin(): Promise<Article[]> {
    return this.articleRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Article> {
    const article = await this.articleRepository.findOne({ where: { id } });
    if (!article) {
      throw new NotFoundException(`Article with ID ${id} not found.`);
    }
    return article;
  }

  async findBySlug(slug: string): Promise<Article> {
    let article = await this.articleRepository.findOne({ 
      where: { slug, published: true } 
    });
    
    if (!article) {
      // Try to find by ID if slug is in format "title-id"
      const parts = slug.split('-');
      const potentialId = parseInt(parts[parts.length - 1]);
      
      if (!isNaN(potentialId)) {
        article = await this.articleRepository.findOne({
          where: { id: potentialId, published: true }
        });
        
        // Generate slug if found but missing
        if (article && !article.slug) {
          article.slug = this.generateSlug(article.title, article.id);
          await this.articleRepository.save(article);
        }
      }
    }
    
    if (!article) {
      throw new NotFoundException(`Article with slug "${slug}" not found.`);
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
