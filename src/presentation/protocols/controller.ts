import { HttpRequest, HttpResponse } from '../protocols/http'

export interface Controller {
	handle (httpResquest: HttpRequest): HttpResponse
}
