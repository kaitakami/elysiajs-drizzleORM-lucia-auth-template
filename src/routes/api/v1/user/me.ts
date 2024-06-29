import { t } from "elysia";

import type { App } from "@/index";
import { authGuard } from "@/plugins/authGuard";

export default (app: App) => {
	app.use(authGuard).get(
		"/me",
		async ({ user }) => {
			return {
				id: user.id,
				email: user.email,
				name: user.name,
			};
		},
		{
			response: t.Object({
				id: t.String(),
				email: t.String(),
				name: t.String(),
			}),
			detail: {
				description: "The me endpoint, will return the user's information.",
			},
			tags: ["user"],
		},
	);

	return app;
};
