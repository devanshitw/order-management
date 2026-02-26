import { MigrationInterface, QueryRunner } from "typeorm";

export class Addresschanges1772128015677 implements MigrationInterface {
    name = 'Addresschanges1772128015677'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "menu_items" DROP CONSTRAINT "FK_menu_items_category"`);
        await queryRunner.query(`ALTER TABLE "order_items" DROP CONSTRAINT "FK_order_items_order"`);
        await queryRunner.query(`ALTER TABLE "order_items" DROP CONSTRAINT "FK_order_items_menu_item"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP CONSTRAINT "FK_orders_user"`);
        await queryRunner.query(`ALTER TABLE "cart_items" DROP CONSTRAINT "FK_cart_items_cart"`);
        await queryRunner.query(`ALTER TABLE "cart_items" DROP CONSTRAINT "FK_cart_items_menu_item"`);
        await queryRunner.query(`ALTER TABLE "carts" DROP CONSTRAINT "FK_carts_user"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_menu_items_category_id"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_order_items_order_id"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_orders_user_id"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_cart_items_cart_id"`);
        await queryRunner.query(`ALTER TABLE "orders" ADD "address_line1" character varying(200)`);
        await queryRunner.query(`ALTER TABLE "orders" ADD "address_line2" character varying(200)`);
        await queryRunner.query(`ALTER TABLE "orders" ADD "city" character varying(100)`);
        await queryRunner.query(`ALTER TABLE "orders" ADD "state" character varying(100)`);
        await queryRunner.query(`ALTER TABLE "orders" ADD "postal_code" character varying(20)`);
        await queryRunner.query(`ALTER TABLE "orders" ADD "country" character varying(100)`);
        await queryRunner.query(`UPDATE "orders" SET "address_line1" = COALESCE("delivery_address", 'N/A'), "city" = 'N/A', "state" = 'N/A', "postal_code" = 'N/A', "country" = 'N/A' WHERE "address_line1" IS NULL`);
        await queryRunner.query(`ALTER TABLE "orders" ALTER COLUMN "address_line1" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "orders" ALTER COLUMN "city" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "orders" ALTER COLUMN "state" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "orders" ALTER COLUMN "postal_code" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "orders" ALTER COLUMN "country" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "delivery_address"`);
        await queryRunner.query(`ALTER TYPE "public"."order_status_enum" RENAME TO "order_status_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."orders_status_enum" AS ENUM('placed', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled')`);
        await queryRunner.query(`ALTER TABLE "orders" ALTER COLUMN "status" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "orders" ALTER COLUMN "status" TYPE "public"."orders_status_enum" USING "status"::"text"::"public"."orders_status_enum"`);
        await queryRunner.query(`ALTER TABLE "orders" ALTER COLUMN "status" SET DEFAULT 'placed'`);
        await queryRunner.query(`DROP TYPE "public"."order_status_enum_old"`);
        await queryRunner.query(`ALTER TYPE "public"."discount_type_enum" RENAME TO "discount_type_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."offers_discount_type_enum" AS ENUM('percentage', 'flat')`);
        await queryRunner.query(`ALTER TABLE "offers" ALTER COLUMN "discount_type" TYPE "public"."offers_discount_type_enum" USING "discount_type"::"text"::"public"."offers_discount_type_enum"`);
        await queryRunner.query(`DROP TYPE "public"."discount_type_enum_old"`);
        await queryRunner.query(`ALTER TABLE "menu_items" ADD CONSTRAINT "FK_20cff56c44dd4fe52d5aa2b96f8" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order_items" ADD CONSTRAINT "FK_145532db85752b29c57d2b7b1f1" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order_items" ADD CONSTRAINT "FK_e462517174f561ece2916701c0a" FOREIGN KEY ("menu_item_id") REFERENCES "menu_items"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "orders" ADD CONSTRAINT "FK_a922b820eeef29ac1c6800e826a" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "cart_items" ADD CONSTRAINT "FK_6385a745d9e12a89b859bb25623" FOREIGN KEY ("cart_id") REFERENCES "carts"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "cart_items" ADD CONSTRAINT "FK_13e501a1cd1a6b1433ded345689" FOREIGN KEY ("menu_item_id") REFERENCES "menu_items"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "carts" ADD CONSTRAINT "FK_2ec1c94a977b940d85a4f498aea" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "carts" DROP CONSTRAINT "FK_2ec1c94a977b940d85a4f498aea"`);
        await queryRunner.query(`ALTER TABLE "cart_items" DROP CONSTRAINT "FK_13e501a1cd1a6b1433ded345689"`);
        await queryRunner.query(`ALTER TABLE "cart_items" DROP CONSTRAINT "FK_6385a745d9e12a89b859bb25623"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP CONSTRAINT "FK_a922b820eeef29ac1c6800e826a"`);
        await queryRunner.query(`ALTER TABLE "order_items" DROP CONSTRAINT "FK_e462517174f561ece2916701c0a"`);
        await queryRunner.query(`ALTER TABLE "order_items" DROP CONSTRAINT "FK_145532db85752b29c57d2b7b1f1"`);
        await queryRunner.query(`ALTER TABLE "menu_items" DROP CONSTRAINT "FK_20cff56c44dd4fe52d5aa2b96f8"`);
        await queryRunner.query(`CREATE TYPE "public"."discount_type_enum_old" AS ENUM('percentage', 'flat')`);
        await queryRunner.query(`ALTER TABLE "offers" ALTER COLUMN "discount_type" TYPE "public"."discount_type_enum_old" USING "discount_type"::"text"::"public"."discount_type_enum_old"`);
        await queryRunner.query(`DROP TYPE "public"."offers_discount_type_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."discount_type_enum_old" RENAME TO "discount_type_enum"`);
        await queryRunner.query(`CREATE TYPE "public"."order_status_enum_old" AS ENUM('placed', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled')`);
        await queryRunner.query(`ALTER TABLE "orders" ALTER COLUMN "status" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "orders" ALTER COLUMN "status" TYPE "public"."order_status_enum_old" USING "status"::"text"::"public"."order_status_enum_old"`);
        await queryRunner.query(`ALTER TABLE "orders" ALTER COLUMN "status" SET DEFAULT 'placed'`);
        await queryRunner.query(`DROP TYPE "public"."orders_status_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."order_status_enum_old" RENAME TO "order_status_enum"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "country"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "postal_code"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "state"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "city"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "address_line2"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "address_line1"`);
        await queryRunner.query(`ALTER TABLE "orders" ADD "delivery_address" character varying(500)`);
        await queryRunner.query(`CREATE INDEX "IDX_cart_items_cart_id" ON "cart_items" ("cart_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_orders_user_id" ON "orders" ("user_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_order_items_order_id" ON "order_items" ("order_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_menu_items_category_id" ON "menu_items" ("category_id") `);
        await queryRunner.query(`ALTER TABLE "carts" ADD CONSTRAINT "FK_carts_user" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "cart_items" ADD CONSTRAINT "FK_cart_items_menu_item" FOREIGN KEY ("menu_item_id") REFERENCES "menu_items"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "cart_items" ADD CONSTRAINT "FK_cart_items_cart" FOREIGN KEY ("cart_id") REFERENCES "carts"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "orders" ADD CONSTRAINT "FK_orders_user" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order_items" ADD CONSTRAINT "FK_order_items_menu_item" FOREIGN KEY ("menu_item_id") REFERENCES "menu_items"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order_items" ADD CONSTRAINT "FK_order_items_order" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "menu_items" ADD CONSTRAINT "FK_menu_items_category" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
