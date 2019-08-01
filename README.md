# shipit-db

A set of database tasks for [Shipit](https://github.com/shipitjs/shipit).

**Features:**

- Works via [shipit-cli](https://github.com/shipitjs/shipit) and [grunt-shipit](https://github.com/shipitjs/grunt-shipit)
- Optionally ignore specified tables

**Roadmap**

- DB Backup tasks

## Install

```
npm install shipit-db
```

## Usage

### Example `shipitfile.js`

```js
module.exports = function (shipit) {
  require('shipit-db')(shipit);

  shipit.initConfig({
    default: {
      ...
    },
    staging: {
      servers: 'user@myserver.com',
      db: {
        adapter  : 'postgres',
        local: {
          host     : 'localhost',
          username : 'root',
          password : 'root',
          database : 'mysite_local',
        },
        remote: {
          host     : '127.0.0.1',
          username : 'myusername',
          password : '123password',
          database : 'mysite_staging',
        }
      }
    },
    production: {
      ...
    }
  });
};
```

Dump your local database, upload and import to remote:

```
shipit staging db:push
```

Dump your remote database, download and import to local:

```
shipit staging db:pull
```

## Options (`shipit.config.db`)

### `db.local` \ `db.remote`

Type: `Object`

An object of database credentials.

## License

MIT
