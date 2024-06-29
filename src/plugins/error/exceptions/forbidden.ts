class ForbiddenException extends Error {
	code = "FORBIDDEN";
	status = 403;
	constructor(message?: string) {
		super(
			message ??
				"You do not the access rights to this resource. Please check your permissions.",
		);
		this.name = "FORBIDDEN";
	}
}

export { ForbiddenException };
