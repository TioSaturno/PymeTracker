ALTER TABLE "analisis" ADD COLUMN "payload_procesado" jsonb;--> statement-breakpoint
ALTER TABLE "analisis" ADD COLUMN "procesado" boolean DEFAULT false;