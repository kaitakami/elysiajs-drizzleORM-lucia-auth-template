import logger from "@/utils/logger";
import cors from "@elysiajs/cors";
import swagger from "@elysiajs/swagger";
import { Elysia } from "elysia";
import { autoroutes } from "elysia-autoroutes";
import { db } from "./db";
import { env } from "@/env";
import path from "node:path";
import { error } from "./plugins/error/error";
import { rateLimit } from "elysia-rate-limit";

const app = new Elysia()
	.use(
		cors({
			origin: ["http://localhost:3000", "http://localhost:3001"],
			allowedHeaders: ["Content-Type", "Authorization"],
		}),
	)
	.use(swagger())
	.use(
		rateLimit({
			max: 60,
		}),
	)
	.use(
		autoroutes({
			routesDir:
				env.NODE_ENV === "test" ? path.resolve(__dirname, "routes") : "routes",
		}),
	)
	.use(error)
	.decorate({
		db,
		logger,
		env,
	})
	.listen(env.SERVER_PORT);

logger.info(
	`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);

export { app };
export type App = typeof app;
