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
OCIO_S3_ENDPOINT=https://moti-int.objectstore.gov.bc.ca
OCIO_S3_KEY=
OCIO_S3_SECRETACCESSKEY=
TPS_POLL_LIMIT = 50
TPS_PENDING_POLLING_INTERVAL = '0 */1 * * * *'
TPS_ERROR_POLLING_INTERVAL = '0 0 */3 * * *'
TPS_MONITORING_POLLING_INTERVAL = '0 0 1 * * *'
SCHEDULER_API_LOG_LEVEL= debug
SCHEDULER_API_TYPEORM_LOG_LEVEL= query,error,warn,info,log,schema
SCHEDULER_API_MAX_QUERY_EXECUTION_TIME_MS= 5000
NODE_ENV=local
DB_TYPE=mssql
MSSQL_HOST= localhost
MSSQL_PORT= 1433
MSSQL_DB=
MSSQL_SA_USER=
MSSQL_SA_PASSWORD=
MSSQL_ENCRYPT=
CFS_PRIVATE_KEY=
CFS_PRIVATE_KEY_PASSPHRASE=
CFS_PUBLIC_KEY=
CFS_SFTP_USERNAME=
CFS_SFTP_HOST=
CFS_SFTP_PORT=
CFS_REMOTE_PATH=./data/
LOCAL_SHARE_FOLDER=C:\\Users\\<username>\\.ssh\\share
SFTP_SHARE_FOLDER=/home/f3535t/data
LOCAL_PUBLIC_KEY_LOCATION=<public key folder location on your local machine>
SFTP_PUBLIC_KEY_LOCATION=/home/f3535t/.ssh/keys/cfs_key.pub:ro
GARMS_HOST=bcsc01.gov.bc.ca
GARMS_USER=
GARMS_PWD=
GARMS_ENV=GARMD
GARMS_CASH_FILE_INTERVAL='0 0 20 * * *'

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
Open [http://localhost:5050/api/](http://localhost:5050/api) to view the swagger api definitions in the browser.

### `npm run test`

Launches the unit tests.

These tests are provided for reference only and do not represent full coverage.

### `npm run test:e2e`

Launches the end-to-end tests.

These tests are provided for reference only and do not represent full coverage.

Unit and end-to-end tests are written using [jest](https://jestjs.io/)

