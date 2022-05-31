const supertest = require('supertest');
const PgPromise = require("pg-promise")
const express = require('express');
const assert = require('assert');
const fs = require('fs');
require('dotenv').config()

const API = require('../api');
const { default: axios } = require('axios');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
//should we use a SSL connection
// let useSSL = false;
// let local = process.env.LOCAL || false;
// if (process.env.DATABASE_URL && !local) {
//   useSSL = true;
//   console.log('im herreeeeeee');
// }

// const connectionString = process.env.DATABASE_URL;

// const pool = new Client({
//   connectionString,
//   ssl: {
//     rejectUnauthorized: false,
//   },
// });

const DATABASE_URL = process.env.DATABASE_URL;

// const pool = new Pool({
//   connectionString,
// });
const pgp = PgPromise({});
const db = pgp(DATABASE_URL);

API(app, db);

describe('The Garment API', function () {

	before(async function () {
		this.timeout(5000);
		await db.none(`delete from garment`);
		const commandText = fs.readFileSync('./sql/data.sql', 'utf-8');
		await db.none(commandText)
	});


	it('should have a test method', async () => {

		const response = await supertest(app)
			.get('/api/test')
			.expect(200);

		assert.deepStrictEqual({ name: 'joe' }, response.body);

	});

	it('should be able to find 30 garments', async () => {
		const response = await supertest(app)
			.get('/api/garments')
			.expect(200);

		const garments = response.body.data;
		assert.equal(30, garments.length);

	})

	it('should be able to find all the Summer garments', async () => {
		const response = await supertest(app)
			.get('/api/garments?season=Summer')
			.expect(200);

		const garments = response.body.data;
		assert.equal(12, garments.length);
	});

	it('should be able to find all the Winter garments', async () => {
		// add some code below

		const response = await supertest(app)
			.get('/api/garments?season=Winter')
			.expect(200);

		const garments = response.body.data;
		assert.equal(5, garments.length);
	});

	it('should be able to find all the Winter Male garments', async () => {
		// change the code statement below

		const response = await supertest(app)
			.get('/api/garments?season=Winter&gender=Male')
			.expect(200);

		const garments = response.body.data;
		assert.equal(3, garments.length);

	});

	it('you should be able to change a given Male garment to a Unisex garment', async () => {

		const description = 'Red hooded jacket';

		// use db.one with an update sql statement
		const garment_by_desc_sql = 'select * from garment where description = $1';

		const garment = await db.one(garment_by_desc_sql, [description]);
		assert.equal('Male', garment.gender);

		await supertest(app)
			.put(`/api/garment/${garment.id}`)
			.send({ gender: 'Unisex' })
			.expect(200);

		//
		const response = await supertest(app)
			.get(`/api/garment/${garment.id}`)
			.expect(200);

		// console.log(response.body)

		assert.equal('Unisex', response.body.data.gender);

	});

	it('you should be able to add 2 Male & 3 Female garments', async () => {


		// write your code above this line

		// const gender_count_sql = 'select count(*) from garment where gender = $1'
		// const maleCount = await db.one(gender_count_sql, ['Male'], r => r.count);
		// const femaleCount = await db.one(gender_count_sql, ['Female'], r => r.count);

		const maleResult = await supertest(app).get(`/api/garments?gender=Male`);
		// console.log(maleResult.body.data);

		assert.equal(13, maleResult.body.data.length)

		const femaleResult = await supertest(app).get(`/api/garments?gender=Female`);
		assert.equal(13, femaleResult.body.data.length)

		await supertest(app)
			.post('/api/garment')
			.send({
				gender: 'Female',
				season: 'Winter',
				description: 'Short winter boots',
				price: 289.25,
				img: 'placeholder.png'
			});

		await supertest(app)
			.post('/api/garment')
			.send({
				gender: 'Female',
				season: 'Winter',
				description: 'Long winter boots',
				price: 289.25,
				img: 'placeholder.png'
			});

		await supertest(app)
			.post('/api/garment')
			.send({
				gender: 'Female',
				season: 'Winter',
				description: 'Long sleeve shirt',
				price: 152.25,
				img: 'placeholder.png'
			});

		await supertest(app).post('/api/garment')
			.send({
				gender: 'Male',
				season: 'Summer',
				description: 'Short sleeve shirt',
				price: 99.25,
				img: 'placeholder.png'
			});
		await supertest(app).post('/api/garment')
			.send({
				gender: 'Male',
				season: 'Summer',
				description: 'Panama hat',
				price: 252.25,
				img: 'placeholder.png'
			});

		// went down 1 as the previous test is changing a male garment to a female one
		const updatedMaleResult = await supertest(app).get(`/api/garments?gender=Male`);
		assert.equal(15, updatedMaleResult.body.data.length);

		const updatedFemaleResult = await supertest(app).get(`/api/garments?gender=Female`);
		assert.equal(16, updatedFemaleResult.body.data.length);

	});

	it('you should be able to group garments by gender and count them', async () => {

		// and below this line for this function will
		const result = await supertest(app)
				.get(`/api/garments/grouped`)
				.expect(200);

		const garmentsGrouped = result.body;
		// console.log(garmentsGrouped);

		// write your code above this line
		const expectedResult = [
			{
				gender: 'Unisex',
				count: '4'
			},
			{
				gender: 'Male',
				count: '15'
			},
			{
				gender: 'Female',
				count: '16'
			}
			
		]
		assert.deepStrictEqual(expectedResult, garmentsGrouped.data)
	});

	it('you should be able to remove all the Unisex garments', async () => {

		await supertest(app)
			.delete(`/api/garments?gender=Unisex`)
			.expect(200);

		// const unisexResults = await supertest(app).get(`/api/garments?gender=Unisex`);
		// const unisexData = unisexResults.body
		// assert.equal(0, unisexData.data.length);

	});

	after(() => {
		db.$pool.end();
	});
});