import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateArticlesTableSeo1699999999999 implements MigrationInterface {
    name = 'UpdateArticlesTableSeo1699999999999'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Check if table exists
        const table = await queryRunner.getTable('articles');
        if (!table) {
            throw new Error('Articles table does not exist');
        }

        // Check and add columns only if they don't exist
        const columnsToAdd = [
            { name: 'slug', type: 'varchar', nullable: true },
            { name: 'excerpt', type: 'varchar', nullable: true },
            { name: 'published', type: 'boolean', default: false },
            { name: 'publishedAt', type: 'timestamp', nullable: true },
            { name: 'metaDescription', type: 'varchar', nullable: true },
            { name: 'tags', type: 'text', nullable: true }
        ];

        for (const columnDef of columnsToAdd) {
            const existingColumn = table.findColumnByName(columnDef.name);
            if (!existingColumn) {
                const defaultClause = columnDef.default !== undefined ? ` DEFAULT ${columnDef.default}` : '';
                const nullableClause = columnDef.nullable ? '' : ' NOT NULL';
                await queryRunner.query(`
                    ALTER TABLE "articles" 
                    ADD COLUMN "${columnDef.name}" ${columnDef.type}${defaultClause}${nullableClause}
                `);
            }
        }

        // Only generate slugs if the slug column exists and has null values
        const slugColumn = await queryRunner.getTable('articles').then(t => t?.findColumnByName('slug'));
        if (slugColumn) {
            await queryRunner.query(`
                UPDATE "articles" 
                SET "slug" = LOWER(
                    TRIM(
                        REPLACE(
                            REPLACE(
                                REPLACE(
                                    REPLACE(title, ' ', '-'),
                                    '--', '-'
                                ),
                                '''', ''
                            ),
                            '"', ''
                        )
                    )
                ) || '-' || id::text
                WHERE "slug" IS NULL OR "slug" = ''
            `);

            // Check if slug column is nullable and make it NOT NULL if needed
            if (slugColumn.isNullable) {
                await queryRunner.query(`
                    ALTER TABLE "articles" 
                    ALTER COLUMN "slug" SET NOT NULL
                `);
            }

            // Check if unique constraint exists before adding it
            const constraints = await queryRunner.query(`
                SELECT constraint_name 
                FROM information_schema.table_constraints 
                WHERE table_name = 'articles' 
                AND constraint_type = 'UNIQUE' 
                AND constraint_name = 'UQ_articles_slug'
            `);

            if (constraints.length === 0) {
                await queryRunner.query(`
                    ALTER TABLE "articles" 
                    ADD CONSTRAINT "UQ_articles_slug" UNIQUE ("slug")
                `);
            }
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Check if table exists
        const table = await queryRunner.getTable('articles');
        if (!table) {
            return; // Table doesn't exist, nothing to do
        }

        // Remove constraints first
        try {
            await queryRunner.query(`
                ALTER TABLE "articles" 
                DROP CONSTRAINT IF EXISTS "UQ_articles_slug"
            `);
        } catch (error) {
            // Constraint might not exist, ignore error
        }

        // Remove columns only if they exist
        const columnsToRemove = ['slug', 'excerpt', 'published', 'publishedAt', 'metaDescription', 'tags'];
        
        for (const columnName of columnsToRemove) {
            const existingColumn = table.findColumnByName(columnName);
            if (existingColumn) {
                await queryRunner.query(`
                    ALTER TABLE "articles" 
                    DROP COLUMN "${columnName}"
                `);
            }
        }
    }
}
