CREATE TABLE "analisis" (
	"id" serial PRIMARY KEY NOT NULL,
	"tienda_id" integer,
	"usuario_id" integer,
	"status" varchar(20) DEFAULT 'pending',
	"payload_data" jsonb NOT NULL,
	"payload_procesado" jsonb,
	"procesado" boolean DEFAULT false,
	"fecha_ejecucion" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
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
	"rut" varchar(20),
	"nombre" varchar(255) NOT NULL,
	"rubro" varchar(100),
	"direccion" text,
	"comuna" varchar(100),
	"telefono" varchar(50),
	"dia_seleccionado" varchar(10) DEFAULT 'lunes',
	"fecha_registro" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "inventarios" (
	"id" serial PRIMARY KEY NOT NULL,
	"tienda_id" integer,
	"nombre" varchar(255) NOT NULL,
	"categoria" varchar(100) NOT NULL,
	"precio" integer NOT NULL,
	"fecha_agregado" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "suscripciones" (
	"id" serial PRIMARY KEY NOT NULL,
	"usuario_id" integer NOT NULL,
	"plan" varchar(50) DEFAULT 'premium' NOT NULL,
	"precio" integer NOT NULL,
	"moneda" varchar(10) DEFAULT 'CLP' NOT NULL,
	"estado" varchar(20) DEFAULT 'activa' NOT NULL,
	"fecha_inicio" timestamp DEFAULT now() NOT NULL,
	"fecha_fin" timestamp NOT NULL,
	"fecha_cancelacion" timestamp,
	"metodo_pago" varchar(50),
	"referencia_pago" varchar(255),
	"created_at" timestamp DEFAULT now()
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
CREATE TABLE "usuario_empresas" (
	"id" serial PRIMARY KEY NOT NULL,
	"usuario_id" integer NOT NULL,
	"empresa_id" integer NOT NULL,
	"rol" varchar(50) DEFAULT 'admin',
	"fecha_union" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "usuarios" (
	"id" serial PRIMARY KEY NOT NULL,
	"nombre" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"password_hash" text NOT NULL,
	"rol" varchar(50) DEFAULT 'admin',
	"flow_customer_id" varchar(255),
	"reset_token" varchar(255),
	"reset_token_expires" timestamp,
	"fecha_creacion" timestamp DEFAULT now(),
	CONSTRAINT "usuarios_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "analisis" ADD CONSTRAINT "analisis_tienda_id_tiendas_id_fk" FOREIGN KEY ("tienda_id") REFERENCES "public"."tiendas"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "analisis" ADD CONSTRAINT "analisis_usuario_id_usuarios_id_fk" FOREIGN KEY ("usuario_id") REFERENCES "public"."usuarios"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "inventarios" ADD CONSTRAINT "inventarios_tienda_id_tiendas_id_fk" FOREIGN KEY ("tienda_id") REFERENCES "public"."tiendas"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "suscripciones" ADD CONSTRAINT "suscripciones_usuario_id_usuarios_id_fk" FOREIGN KEY ("usuario_id") REFERENCES "public"."usuarios"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tiendas" ADD CONSTRAINT "tiendas_empresa_id_empresas_id_fk" FOREIGN KEY ("empresa_id") REFERENCES "public"."empresas"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tiendas" ADD CONSTRAINT "tiendas_ciudad_id_ciudades_id_fk" FOREIGN KEY ("ciudad_id") REFERENCES "public"."ciudades"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "usuario_empresas" ADD CONSTRAINT "usuario_empresas_usuario_id_usuarios_id_fk" FOREIGN KEY ("usuario_id") REFERENCES "public"."usuarios"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "usuario_empresas" ADD CONSTRAINT "usuario_empresas_empresa_id_empresas_id_fk" FOREIGN KEY ("empresa_id") REFERENCES "public"."empresas"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_analisis_payload" ON "analisis" USING gin ("payload_data");