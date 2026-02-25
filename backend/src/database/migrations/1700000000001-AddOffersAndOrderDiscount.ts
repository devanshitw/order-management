import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddOffersAndOrderDiscount1700000000001
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create discount_type enum
    await queryRunner.query(
      `CREATE TYPE "discount_type_enum" AS ENUM ('percentage', 'flat')`,
    );

    // Create offers table
    await queryRunner.query(`
      CREATE TABLE "offers" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "title" varchar(200) NOT NULL,
        "description" text,
        "discount_type" "discount_type_enum" NOT NULL,
        "discount_value" decimal(10,2) NOT NULL,
        "min_order_amount" decimal(10,2) NOT NULL DEFAULT 0,
        "coupon_code" varchar(50),
        "is_active" boolean NOT NULL DEFAULT true,
        "valid_from" timestamptz NOT NULL,
        "valid_until" timestamptz NOT NULL,
        "is_deleted" boolean NOT NULL DEFAULT false,
        "created_at" timestamp NOT NULL DEFAULT now(),
        "updated_at" timestamp NOT NULL DEFAULT now(),
        CONSTRAINT "PK_offers" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_offers_coupon_code" UNIQUE ("coupon_code")
      )
    `);

    // Add discount columns to orders table
    await queryRunner.query(
      `ALTER TABLE "orders" ADD "discount_amount" decimal(10,2) NOT NULL DEFAULT 0`,
    );
    await queryRunner.query(
      `ALTER TABLE "orders" ADD "coupon_code" varchar(50)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "orders" DROP COLUMN "coupon_code"`,
    );
    await queryRunner.query(
      `ALTER TABLE "orders" DROP COLUMN "discount_amount"`,
    );
    await queryRunner.query(`DROP TABLE "offers"`);
    await queryRunner.query(`DROP TYPE "discount_type_enum"`);
  }
}
