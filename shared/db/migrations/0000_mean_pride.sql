CREATE TABLE "analisis" (
	"id" serial PRIMARY KEY NOT NULL,
	"tienda_id" integer,
	"usuario_id" integer,
	"status" varchar(20) DEFAULT 'pending',
	"payload_data" jsonb NOT NULL,
	"fecha_ejecucion" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "ciudades" (
	"id" serial PRIMARY KEY NOT NULL,
	"nombre" varchar(100) NOT NULL,
	"region" varchar(100)
);
--> statement-breakpoint
CREATE TABLE "empresas" (
	"id" serial PRIMARY KEY NOT NULL,
	"nombre" varchar(255) NOT NULL,
	"rubro" varchar(100),
	"fecha_registro" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "tiendas" (
	"id" serial PRIMARY KEY NOT NULL,
	"empresa_id" integer,
	"ciudad_id" integer,
	"nombre" varchar(255) NOT NULL,
	"direccion" text,
	"fecha_creacion" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "usuarios" (
	"id" serial PRIMARY KEY NOT NULL,
	"empresa_id" integer,
	"nombre" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"password_hash" text NOT NULL,
	"rol" varchar(50) DEFAULT 'admin',
	"fecha_creacion" timestamp DEFAULT now(),
	CONSTRAINT "usuarios_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "analisis" ADD CONSTRAINT "analisis_tienda_id_tiendas_id_fk" FOREIGN KEY ("tienda_id") REFERENCES "public"."tiendas"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "analisis" ADD CONSTRAINT "analisis_usuario_id_usuarios_id_fk" FOREIGN KEY ("usuario_id") REFERENCES "public"."usuarios"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tiendas" ADD CONSTRAINT "tiendas_empresa_id_empresas_id_fk" FOREIGN KEY ("empresa_id") REFERENCES "public"."empresas"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tiendas" ADD CONSTRAINT "tiendas_ciudad_id_ciudades_id_fk" FOREIGN KEY ("ciudad_id") REFERENCES "public"."ciudades"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "usuarios" ADD CONSTRAINT "usuarios_empresa_id_empresas_id_fk" FOREIGN KEY ("empresa_id") REFERENCES "public"."empresas"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_analisis_payload" ON "analisis" USING gin ("payload_data");