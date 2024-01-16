#  onRouteBC Vehicles

This a [NestJs] (https://nestjs.com/) project. 

## Technologies Used
- [NestJS](https://nestjs.com/)
- [TypeORM](https://typeorm.io/)

### Environment Variables

Create a .env file in the root directory of onRouteBC and add the following variables:

```conf
DEV_CC_NUMBER=
DEV_CC_CVD=
DEV_CC_EXPMONTH=
DEV_CC_EXPYEAR=
MOTIPAY_API_KEY=
MOTIPAY_MERCHANT_ID=
MOTIPAY_BASE_URL=
MOTIPAY_REDIRECT=
PAYBC_REF_NUMBER=
PAYBC_BASE_URL=
PAYBC_API_KEY=
PAYBC_REDIRECT=
GL_CODE=
OCIO_S3_ACCESSKEYID=
OCIO_S3_BUCKET=
OCIO_S3_PRESIGNED_URL_EXPIRY=
OCIO_S3_ENDPOINT=
OCIO_S3_KEY=
OCIO_S3_SECRETACCESSKEY=
ACCESS_API_URL=
VEHICLES_API_LOG_LEVEL=
VEHICLES_API_MAX_QUERY_EXECUTION_TIME_MS=
VEHICLES_API_TYPEORM_LOG_LEVEL=
DOPS_API_LOG_LEVEL=
DOPS_API_TYPEORM_LOG_LEVEL=
DOPS_API_MAX_QUERY_EXECUTION_TIME_MS=
TPS_POLL_LIMIT = 
TPS_PENDING_POLLING_INTERVAL = 
TPS_ERROR_POLLING_INTERVAL = 
TPS_API_LOG_LEVEL=
TPS_API_TYPEORM_LOG_LEVEL=
TPS_API_MAX_QUERY_EXECUTION_TIME_MS=
DOPS_CVSE_FORMS_CACHE_TTL_MS=
DOPS_URL=
FRONT_END_URL=
NODE_ENV=
CDOGS_TOKEN_URL =
CDOGS_URL=
CDOGS_CLIENT_ID=
CDOGS_CLIENT_SECRET=
CHES_TOKEN_URL=
CHES_CLIENT_ID=
CHES_CLIENT_SECRET=
CHES_URL=
VITE_KEYCLOAK_ISSUER_URL=
VITE_KEYCLOAK_AUDIENCE=
KEYCLOAK_ISSUER_URL=
KEYCLOAK_AUDIENCE=
KEYCLOAK_IGNORE_EXP=
DB_TYPE=
MSSQL_HOST=
MSSQL_PORT=
MSSQL_DB=
MSSQL_SA_USER=
MSSQL_SA_PASSWORD=
MSSQL_ENCRYPT=
MSSQL_INIT_DDL_FILENAME=
MSSQL_LOAD_SAMPLE_DATA=
MSSQL_MOTI_HOST=
MSSQL_MOTI_DB=
MSSQL_MOTI_USER=
MSSQL_MOTI_PASSWORD=
SAMPLE_PENDING_IDIR_USERS=

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
Open [http://localhost:5000/api](http://localhost:5000/api) to view the swagger api definitions in the browser.

### `npm run test`

Launches the unit tests.

These tests are provided for reference only and do not represent full coverage.

### `npm run test:e2e`

Launches the end-to-end tests.

These tests are provided for reference only and do not represent full coverage.

Unit and end-to-end tests are written using [jest](https://jestjs.io/)

