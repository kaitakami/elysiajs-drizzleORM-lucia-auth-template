import { t } from "elysia";
import { password as bunPassword } from "bun";

import type { App } from "@/index";
import { db } from "@/db";
import { BadRequestException } from "@/plugins/error/exceptions";
import { lucia } from "@/auth/lucia";

export default (app: App) => {
	app.post(
		"/signin",
		async ({
			body: { email, password },
			logger,
			env: { PASSWORD_PEPPER: passwordPepper },
			cookie,
			set,
		}) => {
			logger.info({ email }, "Signin request");
			const user = await db.query.users.findFirst({
				where: (users, { eq }) => eq(users.email, email),
			});

			if (!user || !user.passwordSalt || !user.hashedPassword) {
				logger.error("User not found.");
				throw new BadRequestException("User not found.");
			}

			if (!passwordPepper) {
				logger.error("Password pepper is not set.");
				throw new Error("Password pepper is not set.");
			}

			const passwordValid = await bunPassword.verify(user.passwordSalt + password + passwordPepper, user.hashedPassword);

			if (!passwordValid) {
				logger.error("Password is invalid.");
				throw new BadRequestException("Password is invalid.");
			}

			const session = await lucia.createSession(user.id, {});
			const sessionCookie = lucia.createSessionCookie(session.id);

			set.status = 200;

			cookie[sessionCookie.name]?.set({
				value: sessionCookie.value,
				...sessionCookie.attributes,
			});

			logger.info({ email, id: user.id }, "User signed in");
			return {
				id: user.id,
				email: user.email,
				name: user.name,
			};
		},
		{
			body: t.Object({
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
				description: "The signin endpoint, will authenticate a user and create a session.",
			},
		},
	);

	return app;
};
