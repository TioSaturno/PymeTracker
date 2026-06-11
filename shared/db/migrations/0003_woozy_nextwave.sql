CREATE TABLE "inventarios" (
	"id" serial PRIMARY KEY NOT NULL,
	"tienda_id" integer,
	"nombre" varchar(255) NOT NULL,
	"categoria" varchar(100) NOT NULL,
	"precio" integer NOT NULL,
	"fecha_agregado" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "usuarios" ADD COLUMN "reset_token" varchar(255);--> statement-breakpoint
ALTER TABLE "usuarios" ADD COLUMN "reset_token_expires" timestamp;--> statement-breakpoint
ALTER TABLE "inventarios" ADD CONSTRAINT "inventarios_tienda_id_tiendas_id_fk" FOREIGN KEY ("tienda_id") REFERENCES "public"."tiendas"("id") ON DELETE cascade ON UPDATE no action;