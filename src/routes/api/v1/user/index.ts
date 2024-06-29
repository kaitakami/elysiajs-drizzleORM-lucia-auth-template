import type { App } from "@/index";
import me from "./me";

export default (app: App) => {
	app.use(me);
	return app;
};
