import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class UpdateArticlesTable1640000000003 implements MigrationInterface {
  name = 'UpdateArticlesTable1640000000003';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Check if articles table exists
    const table = await queryRunner.getTable('articles');
    
    if (table) {
      // If table exists, check if it has the old schema (author column)
      const authorColumn = table.findColumnByName('author');
      const imageColumn = table.findColumnByName('image');
      
      if (authorColumn && !imageColumn) {
        // Table has old schema, drop and recreate with new schema
        await queryRunner.dropTable('articles');
        
        // Create new table with updated schema
        await queryRunner.createTable(
          new Table({
            name: 'articles',
            columns: [
              {
                name: 'id',
                type: 'integer',
                isPrimary: true,
                isGenerated: true,
                generationStrategy: 'increment',
              },
              {
                name: 'title',
                type: 'varchar',
              },
              {
                name: 'content',
                type: 'text',
              },
              {
                name: 'image',
                type: 'json',
              },
              {
                name: 'createdAt',
                type: 'timestamp',
                default: 'CURRENT_TIMESTAMP',
              },
            ],
          }),
          true,
        );
      }
    } else {
      // Table doesn't exist, create it with new schema
      await queryRunner.createTable(
        new Table({
          name: 'articles',
          columns: [
            {
              name: 'id',
              type: 'integer',
              isPrimary: true,
              isGenerated: true,
              generationStrategy: 'increment',
            },
            {
              name: 'title',
              type: 'varchar',
            },
            {
              name: 'content',
              type: 'text',
            },
            {
              name: 'image',
              type: 'json',
            },
            {
              name: 'createdAt',
              type: 'timestamp',
              default: 'CURRENT_TIMESTAMP',
            },
          ],
        }),
        true,
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop the table and recreate with old schema
    await queryRunner.dropTable('articles');
    
    await queryRunner.createTable(
      new Table({
        name: 'articles',
        columns: [
          {
            name: 'id',
            type: 'integer',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'title',
            type: 'varchar',
          },
          {
            name: 'content',
            type: 'text',
          },
          {
            name: 'author',
            type: 'varchar',
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
      true,
    );
  }
} 