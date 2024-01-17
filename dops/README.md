#  onRouteBC DOPS

This a [NestJs](https://nestjs.com/) project. 

## Technologies Used
- [NestJS](https://nestjs.com/)
- [TypeORM](https://typeorm.io/)

### Environment Variables

Create a .env file in the root directory of onRouteBC and add the following variables:

```conf

ACCESS_API_URL=
DOPS_URL=
NODE_ENV=
CDOGS_TOKEN_URL =
CDOGS_CLIENT_ID=
CDOGS_CLIENT_SECRET=
CHES_TOKEN_URL=
CHES_CLIENT_ID=
CHES_CLIENT_SECRET=
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

