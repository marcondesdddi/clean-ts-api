import request from 'supertest'
import app from '../config/app'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper'

describe('SignUp Routes', () => {
	beforeAll(async () => {
		const uri = process.env.MONGO_URL || ''
		await MongoHelper.connect(uri)
	})

	afterAll(async () => {
		await MongoHelper.disconnect()
	})

	beforeEach(async () => {
		const accountCollection = MongoHelper.getCollection('accounts')
		accountCollection.deleteMany({})
	})

	test('Should return an account on success', async () => {
		await request(app)
			.post('/api/signup')
			.send({
				name: 'Diego',
				email: 'diego@gmail.com',
				password: '123',
				passwordConfirmation: '123'
			})
			.expect(200)
	})
})