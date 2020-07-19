import { LogControllerDecorator } from './log'
import { Controller, HttpResponse, HttpRequest } from '@/presentation/protocols'
import { serverError } from '../../presentation/helpers/http-helper'
import { LogErrorRepository } from '../../data/protocols/log-error-repository'

const makeLogErrorRepository = (): LogErrorRepository => {
	class LogErrorRepositoryStub implements LogErrorRepository {
		async log (stack: string): Promise<void> {
			return new Promise(resolve => resolve())
		}
	}
	return new LogErrorRepositoryStub()
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

interface SutTypes {
	sut: LogControllerDecorator
	controllerStub: Controller
	logErrorRepositoryStub: LogErrorRepository
}

const makeStu = (): SutTypes => {
	const controllerStub = makeController()
	const logErrorRepositoryStub = makeLogErrorRepository()
	const sut = new LogControllerDecorator(controllerStub, logErrorRepositoryStub)
	return {
		sut,
		controllerStub,
		logErrorRepositoryStub
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

	test('Should return the same result of the controller', async () => {
		const { sut } = makeStu()
		const httpRequest = {
			body: {
				name: 'any_mail@mail.com',
				email: 'any_name',
				password: 'any_password',
				passwordConfirmation: 'any_password'
			}
		}
		const httpResponse = await sut.handle(httpRequest)
		expect(httpResponse).toEqual({
			statusCode: 200,
				body: {
					name: 'Diego'
				}
		})
	})

	test('Should call LogErrorRepository with correct error if controller returns a server error', async () => {
		const { sut, controllerStub, logErrorRepositoryStub } = makeStu()
		const fakeError = new Error()
		fakeError.stack = 'any_stack'
		const error = serverError(fakeError)
		const logSpy = jest.spyOn(logErrorRepositoryStub, 'log')
		jest.spyOn(controllerStub, 'handle').mockReturnValueOnce(new Promise(resolve => resolve(error)))
		const httpRequest = {
			body: {
				name: 'any_mail@mail.com',
				email: 'any_name',
				password: 'any_password',
				passwordConfirmation: 'any_password'
			}
		}
		await sut.handle(httpRequest)
		expect(logSpy).toHaveBeenCalledWith('any_stack')
	})
})
