CREATE TABLE "resumenes_resenas" (
	"id" serial PRIMARY KEY NOT NULL,
	"analisis_id" integer,
	"empresa_id" integer NOT NULL,
	"resumen" text NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "resumenes_resenas" ADD CONSTRAINT "resumenes_resenas_analisis_id_analisis_id_fk" FOREIGN KEY ("analisis_id") REFERENCES "public"."analisis"("id") ON DELETE cascade ON UPDATE no action;