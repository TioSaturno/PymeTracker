CREATE TABLE "usuario_empresas" (
	"id" serial PRIMARY KEY NOT NULL,
	"usuario_id" integer NOT NULL,
	"empresa_id" integer NOT NULL,
	"rol" varchar(50) DEFAULT 'admin',
	"fecha_union" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "usuarios" DROP CONSTRAINT "usuarios_empresa_id_empresas_id_fk";
--> statement-breakpoint
ALTER TABLE "usuario_empresas" ADD CONSTRAINT "usuario_empresas_usuario_id_usuarios_id_fk" FOREIGN KEY ("usuario_id") REFERENCES "public"."usuarios"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "usuario_empresas" ADD CONSTRAINT "usuario_empresas_empresa_id_empresas_id_fk" FOREIGN KEY ("empresa_id") REFERENCES "public"."empresas"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "usuarios" DROP COLUMN "empresa_id";