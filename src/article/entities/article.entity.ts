import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert, BeforeUpdate } from 'typeorm';

export interface ArticleImage {
  alt: string;
  src: string;
}

@Entity('articles')
export class Article {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ unique: true, nullable: true })
  slug: string;

  @Column('text')
  content: string;

  @Column({ nullable: true })
  excerpt: string;

  @Column('json')
  image: ArticleImage;

  @Column({ default: false })
  published: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  publishedAt: Date;

  @Column({ nullable: true })
  metaDescription: string;

  @Column('simple-array', { nullable: true })
  tags: string[];

  @BeforeInsert()
  @BeforeUpdate()
  generateSlug() {
    if (this.title && !this.slug) {
      this.slug = this.title
        .toLowerCase()
        .replace(/[^a-z0-9 -]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
    }
  }

  @BeforeUpdate()
  updatePublishedAt() {
    if (this.published && !this.publishedAt) {
      this.publishedAt = new Date();
    }
  }
}
