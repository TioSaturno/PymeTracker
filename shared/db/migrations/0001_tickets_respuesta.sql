ALTER TABLE "tickets" ADD COLUMN "respuesta" text;--> statement-breakpoint
ALTER TABLE "tickets" ADD COLUMN "respondido_por" integer;--> statement-breakpoint
ALTER TABLE "tickets" ADD COLUMN "fecha_respuesta" timestamp;--> statement-breakpoint
ALTER TABLE "tickets" ADD CONSTRAINT "tickets_respondido_por_usuarios_id_fk" FOREIGN KEY ("respondido_por") REFERENCES "public"."usuarios"("id") ON DELETE no action ON UPDATE no action;