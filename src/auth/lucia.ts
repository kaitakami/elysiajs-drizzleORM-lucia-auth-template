import { DrizzlePostgreSQLAdapter } from "@lucia-auth/adapter-drizzle";
import { Lucia } from "lucia";

import { db } from "@/db";
import { sessions, users } from "@/db/schema";

const adapter = new DrizzlePostgreSQLAdapter(db, sessions, users);

export const lucia = new Lucia(adapter, {
	sessionCookie: {
		attributes: {
			// set to `true` when using HTTPS
			secure: process.env.NODE_ENV === "production",
		},
	},
	getUserAttributes: (attributes) => {
		return {
			name: attributes.name,
			email: attributes.email,
			hashedPassword: attributes.hashedPassword,
		};
	},

});

declare module "lucia" {
	interface Register {
		Lucia: typeof lucia;
    DatabaseUserAttributes: DatabaseUserAttributes;
	}
}

interface DatabaseUserAttributes {
	name: string;
	email: string;
	hashedPassword: string;
}
