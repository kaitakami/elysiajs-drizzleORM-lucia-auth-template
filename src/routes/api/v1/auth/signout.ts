import { t } from "elysia";
import { lucia } from "@/auth/lucia";
import { BadRequestException } from "@/plugins/error/exceptions";

import type { App } from "@/index";

export default (app: App) => {
	app.post(
		"/signout",
		async ({ cookie, logger }) => {
			logger.info(cookie, "Signout request");
			const sessionCookie = cookie[lucia.sessionCookieName];

			if (!sessionCookie?.value) {
				logger.error("Session not found.");
				throw new BadRequestException("Session not found.");
			}

			await lucia.invalidateSession(sessionCookie.value);
			const blankSessionCookie = lucia.createBlankSessionCookie();

			sessionCookie.set({
				value: blankSessionCookie.value,
				...blankSessionCookie.attributes,
			});

			logger.info("User signed out");
			return { message: "Successfully signed out" };
		},
		{
			response: t.Object({
				message: t.String(),
			}),
			detail: {
				description:
					"The signout endpoint, will invalidate the user's session and clear the session cookie.",
			},
		},
	);

	return app;
};
