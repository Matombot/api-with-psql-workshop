[![Build Status](https://app.travis-ci.com/Matombot/api-with-psql-workshop.svg?branch=main)](https://app.travis-ci.com/Matombot/api-with-psql-workshop)

# Build an API using PosgreSQL and pg-promise

This workshop builds on the [psql refresher workshop]() you should use SQL that you wrote in that workshop to create the API endpoints needed to make the Unit Tests pass. 

> **The aim is** for you to use the SQL you created in that workshop to create a ExpressJS API.

Run the tests using `npm test` and make the tests pass by implementing the require API calls in `./api.js`.

## Get going

To get going fork and clone this repository into you projects folder.

The run an `npm install`.

After that run a `npm test` see the failing test and fix/add the routes in the `api.js` file.

The unit tests in `test.api.js` starts up the routes via `supertest` and check that the routes does behave appropriately. **Don't change** the `test.api.js` file.

The api end points returns data in this format:

```
{
	status: 'success',
	data: []   // returned dataset here
}
```

There is a mix of `get, post, put & delete` routes that needs to be created.

## Database setup

Ensure a `garment_app` database is configured.

As was used for the `psql refresher workshop`.

> *Note:* if you have done the `psql refresher workshop` your database will configured already.

## Using a local database

To create a local postgresql database follow the instructions below.

> **Note:** only follow the instructions below if you would like to add a local PostgreSQL database instance. You can skip this initially if you are using an elephantsql.com database instance for example.

Connect to the database using the postgresql user.

On Ubuntu use this command:

```
sudo -u postgres psql;
```

On Windows use this command:

```
psql -U postgres
```

Once done with that create a database & user:

```sql
create database garment_app;
create role gary login password 'gar123';
grant all privileges on database garment_app to gary;
```

Add the following entry to you `.env` file in the root of your project.

```
DATABASE_URL=postgres://gary:gar123@localhost:5432/garment_app
```

## Create the garment table

Run the `sql/garment.sql` script locally as the `gary` user and not the `postgres` user.

Connect to the database using this command:

```
psql -U gary -d garment_app
```

Sometimes you need to specify `-h localhost` part like this:

```
psql -h localhost -U gary  -W -d garment_app
```

Create the garment table in the new database using the `\i sql/garment.sql` command in `psql`.

When you run the test using `npm test` the unit test will populate the `garment` table accordingly.