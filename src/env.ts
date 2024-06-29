import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
	clientPrefix: "PUBLIC_",
	server: {
		NODE_ENV: z
			.enum(["development", "production", "test"])
			.default("development"),
		DATABASE_URL: z.string().url(),
		SERVER_PORT: z
			.string()
			.transform((s) => Number.parseInt(s, 10))
			.pipe(z.number().int().positive()),
		PASSWORD_PEPPER: z.string(),
	},
	client: {},
	/**
	 * Makes sure you explicitly access **all** environment variables
	 * from `server` and `client` in your `runtimeEnv`.
	 */
	runtimeEnvStrict: {
		NODE_ENV: process.env.NODE_ENV,
		DATABASE_URL: process.env.DATABASE_URL,
		SERVER_PORT: process.env.SERVER_PORT,
		PASSWORD_PEPPER: process.env.PASSWORD_PEPPER,
	},
	emptyStringAsUndefined: true,
	isServer: typeof window === "undefined",
});
