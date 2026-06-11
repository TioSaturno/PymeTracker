CREATE TABLE "tickets" (
	"id" serial PRIMARY KEY NOT NULL,
	"usuario_id" integer,
	"empresa_id" integer,
	"asunto" varchar(255) NOT NULL,
	"descripcion" text NOT NULL,
	"status" varchar(20) DEFAULT 'abierto',
	"prioridad" varchar(20) DEFAULT 'media',
	"fecha_creacion" timestamp DEFAULT now(),
	"fecha_actualizacion" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "tickets" ADD CONSTRAINT "tickets_usuario_id_usuarios_id_fk" FOREIGN KEY ("usuario_id") REFERENCES "public"."usuarios"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tickets" ADD CONSTRAINT "tickets_empresa_id_empresas_id_fk" FOREIGN KEY ("empresa_id") REFERENCES "public"."empresas"("id") ON DELETE cascade ON UPDATE no action;