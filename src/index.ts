import logger from "@/utils/logger";
import cors from "@elysiajs/cors";
import swagger from "@elysiajs/swagger";
import { Elysia } from "elysia";
import { autoroutes } from "elysia-autoroutes";
import { db } from "./db";

const app = new Elysia()
	.use(cors())
	.use(swagger())
	.use(
		autoroutes({
			routesDir: "./routes",
		}),
	)
	.decorate("db", db)

	.listen(3000);

logger.info(
	`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);

export { app };
export type App = typeof app;
