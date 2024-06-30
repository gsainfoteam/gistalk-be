# Gistalk-Backend

## Description

Backend repository for Gistalk project.

## Deployments

### production

<https://api.gistalk.gistory.me>

### staging

<https://api.stg.gistalk.gistory.me>

## Database Diagram

Entity Relation Diagram is made by [dbdocs](https://dbdocs.io)  
It is available [here](https://dbdocs.io/INFOTEAM%20GIST/Gistalk)

## Installation

```bash
# install all package
$ npm install
```

## Setting prisma client

Since this application uses the prisma client, to run this application, prisma client must be generated before running application.

```bash
# generate prisma client
$ npx prisma generate
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod

# production mode with database change
$ npm run start:deploy 
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
