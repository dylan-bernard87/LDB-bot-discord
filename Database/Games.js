const { MongoClient } = require('mongodb');

module.exports =
  class Games
  {
    constructor(urlBd, dbname)
    {
      this.urlBd = urlBd;
      this.dbname = dbname;
    }

    async getAllGames ()
    {
      const client = new MongoClient(this.urlBd);

      await client.connect();
      const database = client.db(this.dbname);

      const users = database.collection("games");

      let result = await users.find().toArray();

      return result;
    }

    async searchGame(name)
    {
      const client = new MongoClient(this.urlBd);

      await client.connect();
      const database = client.db(this.dbname);

      const users = database.collection("games");

      let result = await users.findOne({
        $or :
        [
          { name : new RegExp(`^${name}$`, 'i') },
          { abbrv: new RegExp(`^${name}$`, 'i') }
        ]
      });

      return result;
    }
  }
 
 