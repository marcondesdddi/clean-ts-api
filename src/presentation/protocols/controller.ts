import { HttpRequest, HttpResponse } from '../protocols/http'

export interface Controller {
	handle (httRequest: HttpRequest): Promise<HttpResponse>
}
