import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

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

  @Column('text')
  content: string;

  @Column('json')
  image: ArticleImage;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}