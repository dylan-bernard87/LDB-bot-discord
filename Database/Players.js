const { MongoClient } = require('mongodb');

module.exports =
  class Players {

    constructor(urlBd, dbname) {
      this.urlBd = urlBd;
      this.dbname = dbname;
    }
  }