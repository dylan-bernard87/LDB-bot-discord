const { MongoClient } = require('mongodb');

module.exports =
  class Bros {

    constructor(urlBd, dbname) {
      this.urlBd = urlBd;
      this.dbname = dbname;
    }
  }