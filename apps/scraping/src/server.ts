import Fastify from "fastify";
import cors from "@fastify/cors";
import { runPipeline } from "./pipeline";

const server = Fastify({ logger: true });

server.register(cors, { origin: true });

server.post<{
  Body: {
    analisisId: number;
    topic: string;
    location: string;
    nResults: number;
    tiendaBase?: string;
  };
}>("/run", async (request, reply) => {
  const { analisisId, topic, location, nResults, tiendaBase } = request.body;
  console.log(`[Scraper Server] nResults recibido: ${nResults}`);

  if (!analisisId || !topic || !location || !nResults) {
    return reply.status(400).send({
      error: "Faltan campos requeridos: analisisId, topic, location, nResults",
    });
  }

  reply.code(200).send({ success: true });

  runPipeline(analisisId, topic, location, nResults, tiendaBase).catch(
    (err) => {
      server.log.error(err, "Pipeline execution failed");
    },
  );
});

const start = async () => {
  try {
    const port = parseInt(process.env.PORT || "8080", 10);
    await server.listen({ port, host: "0.0.0.0" });
    console.log(`🚀 Servidor de scraping corriendo en puerto ${port}`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();
