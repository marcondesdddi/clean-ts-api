import { LogControllerDecorator } from './log'
import { Controller, HttpResponse, HttpRequest } from '@/presentation/protocols'

interface SutTypes {
	sut: LogControllerDecorator
	controllerStub: Controller
}

const makeController = (): Controller => {
	class ControllerStub implements Controller {
		async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
			const httpResponse: HttpResponse = {
				statusCode: 200,
				body: {
					name: 'Diego'
				}
			}
			return new Promise(resolve => resolve(httpResponse))
		}
	}
	return new ControllerStub()
}

const makeStu = (): SutTypes => {
	const controllerStub = makeController()
	const sut = new LogControllerDecorator(controllerStub)
	return {
		sut,
		controllerStub
	}
}

describe('LogController Decorator', () => {
	test('Should call controller handle', async () => {
		const { sut, controllerStub } = makeStu()
		const handleSpy = jest.spyOn(controllerStub, 'handle')
		const httpRequest = {
			body: {
				name: 'any_mail@mail.com',
				email: 'any_name',
				password: 'any_password',
				passwordConfirmation: 'any_password'
			}
		}
		await sut.handle(httpRequest)
		expect(handleSpy).toHaveBeenCalledWith(httpRequest)
	})
})
