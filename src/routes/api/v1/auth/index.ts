import type { App } from "@/index";
import signup from "./signup";
import signin from "./signin";
import signout from "./signout";

export default (app: App) => {
	app.use(signup);
	app.use(signin);
	app.use(signout);
	return app;
};
