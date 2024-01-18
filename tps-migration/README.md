#  onRouteBC TPS Migration

This a [Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Technologies Used
- [NestJS](https://nestjs.com/)
- [TypeORM](https://typeorm.io/)

### Environment Variables

Create a .env file in the root directory of onRouteBC and add the following variables:

```conf

OCIO_S3_ACCESSKEYID=
OCIO_S3_BUCKET=
OCIO_S3_PRESIGNED_URL_EXPIRY=
OCIO_S3_ENDPOINT=
OCIO_S3_KEY=
OCIO_S3_SECRETACCESSKEY=
TPS_POLL_LIMIT = 
TPS_PENDING_POLLING_INTERVAL = 
TPS_ERROR_POLLING_INTERVAL = 
TPS_API_LOG_LEVEL=
TPS_API_TYPEORM_LOG_LEVEL=
TPS_API_MAX_QUERY_EXECUTION_TIME_MS=
NODE_ENV=
DB_TYPE=
MSSQL_HOST=
MSSQL_PORT=
MSSQL_DB=
MSSQL_SA_USER=
MSSQL_SA_PASSWORD=
MSSQL_ENCRYPT=

```


### Prerequisites

#### [Node.js](https://nodejs.org/en/)

- You’ll need to have Node 18 and npm on your machine. You can use [nvm](https://github.com/nvm-sh/nvm#installation) (macOS/Linux) or [nvm-windows](https://github.com/coreybutler/nvm-windows#node-version-manager-nvm-for-windows) to switch Node versions between different projects.
- Note: We are using Node 18.16.0-alpine as a base image on our pipeline.

### Installation

In the project directory, you can run:

### `npm install`

Install all frontend dependencies

### `npm rum start:dev`

Runs the app in the development mode.

### Swagger API
Open [http://localhost:5050/api/](http://localhost:5050/api) to view the swagger api definitions in the browser.

### `npm run test`

Launches the unit tests.

These tests are provided for reference only and do not represent full coverage.

### `npm run test:e2e`

Launches the end-to-end tests.

These tests are provided for reference only and do not represent full coverage.

Unit and end-to-end tests are written using [jest](https://jestjs.io/)

