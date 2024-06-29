import { t } from "elysia";
import { generateId } from "lucia";
import { alphabet, generateRandomString } from "oslo/crypto";
import { password as bunPassword } from "bun";

import type { App } from "@/index";
import { db } from "@/db";
import { ConflictException, InternalServerErrorException } from "@/plugins/error/exceptions";
import { lucia } from "@/auth/lucia";
import { users } from "@/db/schema";

export default (app: App) => {
	app.post("/signup", async ({ body: { name, email, password }, logger, env: { PASSWORD_PEPPER: passwordPepper }, cookie, set }) => {
		logger.info({ name, email }, "Signup request");
		const existingUser = await db.query.users.findFirst({
			where: (users, {eq}) => eq(users.email, email)
		});

		if (existingUser) {
			logger.error({ name, email, id: existingUser.id }, "User already exists");
			throw new ConflictException("User already exists");
		}

		const userId = generateId(15);
		const passwordSalt = generateRandomString(16, alphabet("a-z", "A-Z", "0-9"));
		const hashedPassword = await bunPassword.hash(passwordSalt + password + passwordPepper);

		try {
			await db.insert(users).values({
				id: userId,
				email,
				hashedPassword: hashedPassword,
				passwordSalt,
				name,
			});

			const session = await lucia.createSession(userId, {});
			const sessionCookie = lucia.createSessionCookie(session.id);

			set.status = 201;
			cookie[sessionCookie.name]?.set({
				value: sessionCookie.value,
				...sessionCookie.attributes,
			});

      logger.info({ name, email, id: userId }, "User created");
			return {
				id: userId,
				email,
				name,
			};
		} catch (error) {
			logger.error(error);
			throw new InternalServerErrorException();
		}
	}, {
		body: t.Object({
			name: t.String({
				description: "The username of the user",
			}),
			email: t.String({
				description: "The email of the user",
			}),
			password: t.String({
				description: "The password of the user",
			}),
		}),
		response: t.Object({
			id: t.String(),
			email: t.String(),
			name: t.String(),
		}),
		detail: {
			description: "The signup endpoint, will create a new user in the database. Throws a 409 if the user already exists.",
		},
	});

	return app;
};
