/* eslint-disable no-tabs */
import { SignUpController } from './signup-controller'
import { MissingParamError, ServerError, EmailInUseError } from '../../errors'
import {
	AccountModel,
	AddAccount,
	AddAccountModel,
	Validation,
	Authentication,
	AuthenticationModel
} from './signup-controller-protocols'
import { HttpRequest } from '../../protocols'
import { ok, serverError, badRequest, forbidden } from '../../helpers/http/http-helper'

const makeAuthentication = (): Authentication => {
	class AuthenticationStub implements Authentication {
		async auth (authentication: AuthenticationModel): Promise<string> {
			return new Promise(resolve => resolve('any_token'))
		}
	}
	return new AuthenticationStub()
}

interface SutTypes {
	sut: SignUpController
	addAccountStub: AddAccount
	validationStub: Validation
	authenticationStub: Authentication
}

const makeFakeRequest = (): HttpRequest => ({
	body: {
		name: 'any_name',
		email: 'any_email@mail.com',
		password: 'any_password',
		passwordConfirmation: 'any_password'
	}
})

const makeFakeAccount = (): AccountModel => ({
	id: 'valid_id',
	name: 'valid_name',
	email: 'valid_email@mail.com',
	password: 'valid_password'
})

const makeAddAccount = (): AddAccount => {
	class AddAccountStub implements AddAccount {
		async add (account: AddAccountModel): Promise<AccountModel> {
			return new Promise(resolve => resolve(makeFakeAccount()))
		}
	}
	return new AddAccountStub()
}

const makeValidation = (): Validation => {
	class ValidationStub implements Validation {
		validate (input: any): Error {
			return null
		}
	}
	return new ValidationStub()
}

const makeSut = (): SutTypes => {
	const authenticationStub = makeAuthentication()
	const addAccountStub = makeAddAccount()
	const validationStub = makeValidation()
	const sut = new SignUpController(addAccountStub, validationStub, authenticationStub)
	return {
		sut,
		addAccountStub,
		validationStub,
		authenticationStub
	}
}

describe('SignUp Controller', () => {
	test('Should call AddAccount with correct values', async () => {
		// sut: system under test
		const { sut, addAccountStub } = makeSut()
		const addSpy = jest.spyOn(addAccountStub, 'add')
		await sut.handle(makeFakeRequest())
		expect(addSpy).toHaveBeenCalledWith({
			name: 'any_name',
			email: 'any_email@mail.com',
			password: 'any_password'
		})
	})

	test('Should return 500 if AddAccount throws', async () => {
		// sut: system under test
		const { sut, addAccountStub } = makeSut()
		jest.spyOn(addAccountStub, 'add').mockImplementationOnce(async () => {
			return new Promise((resolve, reject) => reject(new Error()))
		})
		const httpResponse = await sut.handle(makeFakeRequest())
		expect(httpResponse).toEqual(serverError(new ServerError('')))
	})

	test('Should return 403 if AddAccount return null', async () => {
		// sut: system under test
		const { sut, addAccountStub } = makeSut()
		jest.spyOn(addAccountStub, 'add').mockReturnValueOnce(new Promise(resolve => resolve(null)))
		const httpResponse = await sut.handle(makeFakeRequest())
		expect(httpResponse).toEqual(forbidden(new EmailInUseError()))
	})

	test('Should return 200 if valid data is provided', async () => {
		// sut: system under test
		const { sut } = makeSut()
		const httpResponse = await sut.handle(makeFakeRequest())
		expect(httpResponse).toEqual(ok({ accessToken: 'any_token' }))
	})

	test('Should call Validation with correct values', async () => {
		// sut: system under test
		const { sut, validationStub } = makeSut()
		const validateSpy = jest.spyOn(validationStub, 'validate')
		const httpRequest = makeFakeRequest()
		await sut.handle(httpRequest)
		expect(validateSpy).toHaveBeenCalledWith(httpRequest.body)
	})

	test('Should return 400 if Validation return an error', async () => {
		// sut: system under test
		const { sut, validationStub } = makeSut()
		jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new MissingParamError('any_field'))
		const httpResponse = await sut.handle(makeFakeRequest())
		expect(httpResponse).toEqual(badRequest(new MissingParamError('any_field')))
	})

	test('Should call Authentication with correct value', async () => {
		const { sut, authenticationStub } = makeSut()
		const authSpy = jest.spyOn(authenticationStub, 'auth')
		const httpRequest = makeFakeRequest()
		await sut.handle(httpRequest)
		expect(authSpy).toHaveBeenCalledWith({
			email: 'any_email@mail.com',
			password: 'any_password'
		})
	})

	test('Should return 500 if Authentication throws', async () => {
		const { sut, authenticationStub } = makeSut()
		jest.spyOn(authenticationStub, 'auth').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
		const httpRequest = makeFakeRequest()
		const httpResponse = await sut.handle(httpRequest)
		expect(httpResponse).toEqual(serverError(new Error()))
	})
})
