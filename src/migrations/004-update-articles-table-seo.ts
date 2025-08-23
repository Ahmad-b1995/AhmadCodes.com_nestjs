import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateArticlesTableSeo1699999999999 implements MigrationInterface {
    name = 'UpdateArticlesTableSeo1699999999999'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Add new columns to articles table (slug nullable first)
        await queryRunner.query(`
            ALTER TABLE "articles" 
            ADD COLUMN "slug" varchar,
            ADD COLUMN "excerpt" varchar,
            ADD COLUMN "published" boolean DEFAULT false,
            ADD COLUMN "publishedAt" timestamp NULL,
            ADD COLUMN "metaDescription" varchar,
            ADD COLUMN "tags" text
        `);

        // Generate slugs for existing articles using a simpler approach
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
            WHERE "slug" IS NULL
        `);

        // Make slug column NOT NULL and add unique constraint
        await queryRunner.query(`
            ALTER TABLE "articles" 
            ALTER COLUMN "slug" SET NOT NULL
        `);

        await queryRunner.query(`
            ALTER TABLE "articles" 
            ADD CONSTRAINT "UQ_articles_slug" UNIQUE ("slug")
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Remove the added columns
        await queryRunner.query(`
            ALTER TABLE "articles" 
            DROP COLUMN "slug",
            DROP COLUMN "excerpt",
            DROP COLUMN "published",
            DROP COLUMN "publishedAt",
            DROP COLUMN "metaDescription",
            DROP COLUMN "tags"
        `);
    }
}
