CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS "restaurants" (
  "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
  "name" VARCHAR(255) NOT NULL,
  "image" VARCHAR(255),
  "created_at" TIMESTAMP DEFAULT NOW() NOT NULL,
  "updated_at" TIMESTAMP DEFAULT NOW() NOT NULL,
  CONSTRAINT pk_restaurants PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS "addresses" (
  "postal_code" VARCHAR(255) NOT NULL,
  "state" VARCHAR(255) NOT NULL,
  "city" VARCHAR(255) NOT NULL,
  "neighborhood" VARCHAR(255) NOT NULL,
  "street" VARCHAR(255) NOT NULL,
  "country" VARCHAR(255) NOT NULL,
  "country_code" CHAR(2) NOT NULL,
  "created_at" TIMESTAMP DEFAULT NOW() NOT NULL,
  "updated_at" TIMESTAMP DEFAULT NOW() NOT NULL,
  CONSTRAINT pk_addresses PRIMARY KEY (postal_code)
);

CREATE TABLE IF NOT EXISTS "restaurant_addresses" (
  "restaurant_id" uuid NOT NULL,
  "address_postal_code" VARCHAR(255) NOT NULL,
  "number" SMALLINT NOT NULL,
  "created_at" TIMESTAMP DEFAULT NOW() NOT NULL,
  "updated_at" TIMESTAMP DEFAULT NOW() NOT NULL,
  CONSTRAINT cpk_restaurant_addresses primary key(restaurant_id, address_postal_code, number),
  CONSTRAINT fk_restaurant FOREIGN KEY (restaurant_id) REFERENCES restaurants (id) ON DELETE CASCADE,
  CONSTRAINT fk_address FOREIGN KEY (address_postal_code) REFERENCES addresses (postal_code)
);

CREATE TYPE "weekday_type" AS ENUM(
  'sunday',
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday'
);

CREATE TABLE IF NOT EXISTS "work_schedules" (
  "restaurant_id" uuid NOT NULL,
  "week_day" "weekday_type" NOT NULL,
  "start_hour" TIME,
  "finish_hour" TIME,
  "created_at" TIMESTAMP DEFAULT NOW() NOT NULL,
  "updated_at" TIMESTAMP DEFAULT NOW() NOT NULL,
  CONSTRAINT cpk_work_schedules primary key(restaurant_id, week_day),
  CONSTRAINT fk_restaurant FOREIGN KEY (restaurant_id) REFERENCES restaurants (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS "categories" (
  "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
  "restaurant_id" uuid NOT NULL,
  "name" VARCHAR(255) NOT NULL,
  "created_at" TIMESTAMP DEFAULT NOW() NOT NULL,
  "updated_at" TIMESTAMP DEFAULT NOW() NOT NULL,
  CONSTRAINT pk_categories PRIMARY KEY (id),
  CONSTRAINT fk_restaurant FOREIGN KEY (restaurant_id) REFERENCES restaurants (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS "products" (
  "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
  "restaurant_id" uuid NOT NULL,
  "category_id" uuid,
  "name" VARCHAR(255) NOT NULL,
  "image" VARCHAR(255),
  "price" DECIMAL(10, 2) NOT NULL,
  "start_hour" TIME,
  "finish_hour" TIME,
  "created_at" TIMESTAMP DEFAULT NOW() NOT NULL,
  "updated_at" TIMESTAMP DEFAULT NOW() NOT NULL,
  CONSTRAINT pk_products primary key(id),
  CONSTRAINT fk_restaurant FOREIGN KEY (restaurant_id) REFERENCES restaurants (id) ON DELETE CASCADE,
  CONSTRAINT fk_category FOREIGN KEY (category_id) REFERENCES categories (id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS "promotions" (
  "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
  "product_id" uuid NOT NULL,
  "description" TEXT,
  "price" DECIMAL(10, 2) NOT NULL,
  "start_datetime" TIMESTAMP NOT NULL,
  "finish_datetime" TIMESTAMP NOT NULL,
  "created_at" TIMESTAMP DEFAULT NOW() NOT NULL,
   CONSTRAINT pk_promotions PRIMARY KEY (id),
  CONSTRAINT fk_product FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE CASCADE
);
