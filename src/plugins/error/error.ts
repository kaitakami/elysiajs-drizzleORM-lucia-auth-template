import Elysia from "elysia";
import logger from "@/utils/logger";
import {
	BadGatewayException,
	BadRequestException,
	ConflictException,
	ForbiddenException,
	InternalServerErrorException,
	MethodNotAllowedException,
	NotFoundException,
	NotImplementedException,
	ServiceUnavailableException,
	UnauthorizedException,
} from "./exceptions";

/**
 * 400 - Bad Request
 * BadRequestException
 *
 * 401 - Unauthorized
 * UnauthorizedException
 *
 * 403 - Forbidden
 * ForbiddenException
 *
 * 404 - Not Found
 * NotFoundException
 *
 * 405 - Method Not Allowed
 * MethodNotAllowedException
 *
 * 409 - Conflict
 * ConflictException
 *
 * 500 - Internal Server Error
 * InternalServerErrorException
 *
 * 501 - Not Implemented
 * NotImplementedException
 *
 * 502 - Bad Gateway
 * BadGatewayException
 *
 * 503 - Service Unavailable
 * ServiceUnavailableException
 */

const error = new Elysia()
	.decorate("logger", logger)
	.error({
		BadGatewayException,
		BadRequestException,
		ConflictException,
		ForbiddenException,
		InternalServerErrorException,
		MethodNotAllowedException,
		NotFoundException,
		NotImplementedException,
		ServiceUnavailableException,
		UnauthorizedException,
	})
	.onError({ as: "global" }, (ctx) => {
		const { code, error, logger } = ctx;

		switch (code) {
			case "NOT_FOUND":
				return new NotFoundException();
			case "INTERNAL_SERVER_ERROR":
				logger.error({
					code,
					error,
				});
				return new InternalServerErrorException();
			default:
				logger.error({
					code,
					error,
				});
				return error;
		}
	});

export { error };
