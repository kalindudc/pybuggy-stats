# Statistics generation for the [PyBuggy](https://github.com/kalindudc/pybuggy) project

> All generated stats are in .csv format

## MongoDB Setup 

1. This project is created with MongoDb Cloud. Create your own project/cluster [here](https://www.mongodb.com/cloud) for testing purposes.
2. All schemas required can be found in `./modules/*`
3. Make a copy and rename `./.env.template` to  `./.env`
4. Edit the all fields in `< ... >` with your mongo cluster information.

## .env Setup
> Make acopy and rename `./.env.template` to  `./.env` and Edit the all fields in `< ... >`.

```sh
# MongoDB connection URL
DB_HOST=mongodb+srv://<user>:<password>@<cluster url>/<DB name>?retryWrites=true
```

## Available commands

```sh
# install all prerequisites
npm install 
# generate all statistics
npm start 
```