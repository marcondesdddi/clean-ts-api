import { Controller, HttpRequest, HttpResponse } from '../../protocols'
import { badRequest } from '../../helpers/http-helper'
import { MissingParamError } from '../../errors'
import { resolve } from 'path'

export class LoginController implements Controller {
	async handle (httRequest: HttpRequest): Promise<HttpResponse> {
		return new Promise(resolve => resolve(badRequest(new MissingParamError('email'))))
	}
}
