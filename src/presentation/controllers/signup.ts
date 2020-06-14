import { HttpRequest, HttpResponse } from '../protocols/http'
import { MissingParamError } from '../errors/missing-param-error'
import { badRequest } from '../helpers/http-helper'
import { Controller } from '../protocols/controller'

export class SignUpController implements Controller {
  handle (httpResquest: HttpRequest): HttpResponse {
		const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']

		for (const field of requiredFields) {
			if (!httpResquest.body[field]) {
				return badRequest(new MissingParamError(field))
			}
		}

    return {
      statusCode: 200,
      body: {}
    }
  }
}
