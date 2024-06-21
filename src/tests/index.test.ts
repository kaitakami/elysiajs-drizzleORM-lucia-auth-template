import { describe, expect, it } from "bun:test";

import { app } from "@/index";

describe("Health Check", () => {
	it("should return a 200 and a health check", async () => {
		const response = await app
			.handle(new Request("http://localhost/api/v1/health"))
			.then(async (res) => res.json());

		expect(response).toMatchObject({ health: "ok" });
	});

	it("should return 200 and info health check", async () => {
		const response = await app
			.handle(new Request("http://localhost/api/v1/health/info"))
			.then(async (res) => res.json());

		expect(response).toMatchObject({
			cpuUsage: {
				user: expect.any(Number),
				system: expect.any(Number),
			},
			totalMemory: expect.any(Number),
			freeMemory: expect.any(Number),
		});
	});

	it("should return a 404 for a non-existent route", async () => {
		const response = await app
			.handle(new Request("http://localhost/api/v1/not-found"))
			.then(async (res) => res.status);

		expect(response).toBe(404);
	});
});
