import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1700000000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Enable uuid extension
    await queryRunner.query(
      `CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`,
    );

    // Create order_status enum
    await queryRunner.query(
      `CREATE TYPE "order_status_enum" AS ENUM ('placed', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled')`,
    );

    // Create order_number sequence
    await queryRunner.query(
      `CREATE SEQUENCE IF NOT EXISTS "order_number_seq" START WITH 1 INCREMENT BY 1`,
    );

    // ── users ──
    await queryRunner.query(`
      CREATE TABLE "users" (
        "id"            uuid NOT NULL DEFAULT uuid_generate_v4(),
        "name"          varchar(150) NOT NULL,
        "email"         varchar NOT NULL,
        "password"      varchar NOT NULL,
        "phone_number"  varchar,
        "address"       varchar(500),
        "is_deleted"    boolean NOT NULL DEFAULT false,
        "created_at"    TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at"    TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_users" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_users_email" UNIQUE ("email")
      )
    `);

    // ── categories ──
    await queryRunner.query(`
      CREATE TABLE "categories" (
        "id"          uuid NOT NULL DEFAULT uuid_generate_v4(),
        "name"        varchar(100) NOT NULL,
        "description" varchar(500),
        "image_url"   varchar,
        "sort_order"  integer NOT NULL DEFAULT 0,
        "is_active"   boolean NOT NULL DEFAULT true,
        "created_at"  TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at"  TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_categories" PRIMARY KEY ("id")
      )
    `);

    // ── menu_items ──
    await queryRunner.query(`
      CREATE TABLE "menu_items" (
        "id"                       uuid NOT NULL DEFAULT uuid_generate_v4(),
        "name"                     varchar(200) NOT NULL,
        "description"              text,
        "price"                    numeric(10,2) NOT NULL,
        "image_url"                varchar,
        "category_id"              uuid NOT NULL,
        "is_available"             boolean NOT NULL DEFAULT true,
        "is_deleted"               boolean NOT NULL DEFAULT false,
        "preparation_time_minutes" integer,
        "created_at"               TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at"               TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_menu_items" PRIMARY KEY ("id"),
        CONSTRAINT "FK_menu_items_category" FOREIGN KEY ("category_id")
          REFERENCES "categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
      )
    `);

    // ── carts ──
    await queryRunner.query(`
      CREATE TABLE "carts" (
        "id"         uuid NOT NULL DEFAULT uuid_generate_v4(),
        "user_id"    uuid NOT NULL,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_carts" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_carts_user_id" UNIQUE ("user_id"),
        CONSTRAINT "FK_carts_user" FOREIGN KEY ("user_id")
          REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
      )
    `);

    // ── cart_items ──
    await queryRunner.query(`
      CREATE TABLE "cart_items" (
        "id"            uuid NOT NULL DEFAULT uuid_generate_v4(),
        "cart_id"       uuid NOT NULL,
        "menu_item_id"  uuid NOT NULL,
        "quantity"      integer NOT NULL DEFAULT 1,
        "unit_price"    numeric(10,2) NOT NULL,
        "created_at"    TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at"    TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_cart_items" PRIMARY KEY ("id"),
        CONSTRAINT "FK_cart_items_cart" FOREIGN KEY ("cart_id")
          REFERENCES "carts"("id") ON DELETE CASCADE ON UPDATE NO ACTION,
        CONSTRAINT "FK_cart_items_menu_item" FOREIGN KEY ("menu_item_id")
          REFERENCES "menu_items"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
      )
    `);

    // ── orders ──
    await queryRunner.query(`
      CREATE TABLE "orders" (
        "id"                    uuid NOT NULL DEFAULT uuid_generate_v4(),
        "order_number"          varchar(20) NOT NULL,
        "user_id"               uuid NOT NULL,
        "status"                "order_status_enum" NOT NULL DEFAULT 'placed',
        "total_amount"          numeric(10,2) NOT NULL,
        "delivery_address"      varchar(500),
        "notes"                 text,
        "estimated_delivery_at" TIMESTAMPTZ,
        "delivered_at"          TIMESTAMPTZ,
        "is_deleted"            boolean NOT NULL DEFAULT false,
        "created_at"            TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at"            TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_orders" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_orders_order_number" UNIQUE ("order_number"),
        CONSTRAINT "FK_orders_user" FOREIGN KEY ("user_id")
          REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
      )
    `);

    // ── order_items ──
    await queryRunner.query(`
      CREATE TABLE "order_items" (
        "id"            uuid NOT NULL DEFAULT uuid_generate_v4(),
        "order_id"      uuid NOT NULL,
        "menu_item_id"  uuid NOT NULL,
        "quantity"      integer NOT NULL,
        "unit_price"    numeric(10,2) NOT NULL,
        "subtotal"      numeric(10,2) NOT NULL,
        "created_at"    TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at"    TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_order_items" PRIMARY KEY ("id"),
        CONSTRAINT "FK_order_items_order" FOREIGN KEY ("order_id")
          REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE NO ACTION,
        CONSTRAINT "FK_order_items_menu_item" FOREIGN KEY ("menu_item_id")
          REFERENCES "menu_items"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
      )
    `);

    // ── indexes ──
    await queryRunner.query(
      `CREATE INDEX "IDX_menu_items_category_id" ON "menu_items" ("category_id")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_cart_items_cart_id" ON "cart_items" ("cart_id")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_orders_user_id" ON "orders" ("user_id")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_order_items_order_id" ON "order_items" ("order_id")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop tables in reverse dependency order
    await queryRunner.query(`DROP TABLE IF EXISTS "order_items"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "orders"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "cart_items"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "carts"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "menu_items"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "categories"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "users"`);

    // Drop enum and sequence
    await queryRunner.query(`DROP SEQUENCE IF EXISTS "order_number_seq"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "order_status_enum"`);
  }
}
