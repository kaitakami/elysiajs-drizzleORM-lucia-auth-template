import { t } from "elysia";
import os from "node:os";

import type { App } from "@/index";

export default (app: App) => {
	app.get("/", () => ({ health: "ok" }), {
		response: t.Object({
			health: t.String({
				description: "Returns ok for health check",
			}),
		}),
		detail: {
			description: "The root endpoint",
			tags: ["Health"],
		},
	});

	app.get(
		"/info",
		({ logger }) => {
			logger.info("Getting system info");

			const cpuUsage = process.cpuUsage();
			const totalMemory = os.totalmem();
			const freeMemory = os.freemem();

			return {
				cpuUsage,
				totalMemory,
				freeMemory,
			};
		},
		{
			response: t.Object({
				cpuUsage: t.Object({
					user: t.Number(),
					system: t.Number(),
				}),
				totalMemory: t.Number(),
				freeMemory: t.Number(),
			}),
			detail: {
				description: "The info endpoint",
				tags: ["Health"],
			},
		},
	);

	return app;
};
