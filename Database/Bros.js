const { MongoClient } = require('mongodb');

module.exports =
  class Bros
  {
    constructor(urlBd, dbname)
    {
      this.urlBd = urlBd;
      this.dbname = dbname;
    }

    async getLastPlayers()
    {
      const client = new MongoClient(this.urlBd);

      await client.connect();
      const database = client.db(this.dbname);

      const users = database.collection("bros");

      let result = await users.find().limit(1).sort({ creationDate: -1 }).toArray();

      if (result.length == 1)
      {
        return result[0].players;
      }

      return;
    }

    async insertBros(brosList)
    {
      const client = new MongoClient(this.urlBd);

      await client.connect();
      const database = client.db(this.dbname);

      const bros = database.collection("bros");

      const data = {
        creationDate: Date.now(),
        players: brosList
      }

      // We insert an array of string which represent the ids of players/bros
      const result = await bros.insertOne(data);

      client.close();
    }
  }