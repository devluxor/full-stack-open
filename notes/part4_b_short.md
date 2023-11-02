define environment modes:

- development
- test
(- production for deployment)

modify package.json, .env file, helpers , etc. (i.e, don't log requests when NODE_ENV=== 'test', etc)

define how env variables should change for each mode

install testing dependencies (supertest, jest)

prepare if needed special testing database (in the local machine, don't use central, main db)

begin tests

- before each

- after all

- one test at a time, test one after the other when dev./testing/implementing tests

- when done, group tests by describe blocks

- make good use of async/await







