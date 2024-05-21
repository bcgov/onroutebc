#  onRouteBC Vehicles

This a [Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Technologies Used
- [NestJS](https://nestjs.com/)
- [TypeORM](https://typeorm.io/)

### Environment Variables

Create a .env file in the root directory of onRouteBC and add the following variables:

```conf

ACCESS_API_URL=http://localhost:5000
PAYBC_REF_NUMBER=
PAYBC_BASE_URL=https://paydevp.gov.bc.ca/public/directsale
PAYBC_API_KEY=
PAYBC_REDIRECT=http://localhost:3000/payment
GL_CODE=
VEHICLES_API_LOG_LEVEL=debug
VEHICLES_API_MAX_QUERY_EXECUTION_TIME_MS=5000
VEHICLES_API_TYPEORM_LOG_LEVEL=query,error,warn,info,log,schema
DOPS_URL=http://localhost:5001
FRONT_END_URL=http://localhost:3000
NODE_ENV=local
CHES_TOKEN_URL=https://dev.loginproxy.gov.bc.ca/auth/realms/comsvcauth/protocol/openid-connect/token
CHES_CLIENT_ID=
CHES_CLIENT_SECRET=
CHES_URL=https://ches-dev.api.gov.bc.ca/api/v1/
KEYCLOAK_ISSUER_URL=https://dev.loginproxy.gov.bc.ca/auth/realms/standard
KEYCLOAK_AUDIENCE=
KEYCLOAK_IGNORE_EXP=true
DB_TYPE=mssql
MSSQL_HOST=localhost
MSSQL_PORT=1433
MSSQL_DB=
MSSQL_SA_USER=
MSSQL_SA_PASSWORD=
MSSQL_ENCRYPT=

```


### Prerequisites

#### [Node.js](https://nodejs.org/en/)

- You’ll need to have Node 20 and npm on your machine. You can use [nvm](https://github.com/nvm-sh/nvm#installation) (macOS/Linux) or [nvm-windows](https://github.com/coreybutler/nvm-windows#node-version-manager-nvm-for-windows) to switch Node versions between different projects.
- Note: We are using Node 20.11.0-alpine as a base image on our pipeline.

### One time setp up instructions
- Use following command ssh-keygen -m PEM -t Ed25519
- Enter name of the key as cfs_key
- use passphrase while generating keys and save it somewhere.
- In env file do the following :
- set CFS_PRIVATE_KEY to generated private key value as it is in single quotes.
- set CFS_PRIVATE_KEY_PASSPHRASE to given passphrase
- set CFS_PUBLIC_KEY to generated public key.
- set CFS_SFTP_USERNAME to f3535t. (if you chose to use any other username (i.e. not f3535t) then search replace f3535t with your choosen username, in env file.)
- set CFS_SFTP_HOST to your local host ip.
- set CFS_SFTP_PORT to 22.
- set LOCAL_SHARE_FOLDER to path of your local folder you would like to mount on mocked sftp server.
- set SFTP_SHARE_FOLDER = /home/f3535t/data (folder on mocked sftp server).
- set CFS_REMOTE_PATH = ./data/ (if you changed SFTP_SHARE_FOLDER from data to something else then update CFS_REMOTE_PATH to reflect the same)
- set LOCAL_PUBLIC_KEY_LOCATION to  public key location on your system
- set SFTP_PUBLIC_KEY_LOCATION as /home/f3535t/.ssh/keys/cfs_key.pub:ro . It is public key location on mocked sftp, if placed here the key gets added to authorised key file and then we can make a connection using private kaey and passphrase.

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

