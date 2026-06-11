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
ALTER TABLE "suscripciones" ADD CONSTRAINT "suscripciones_usuario_id_usuarios_id_fk" FOREIGN KEY ("usuario_id") REFERENCES "public"."usuarios"("id") ON DELETE cascade ON UPDATE no action;