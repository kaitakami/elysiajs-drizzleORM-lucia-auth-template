import type { App } from "@/index";
import signup from "./signup";

export default (app: App) => {
	app.use(signup);
	return app;
};
