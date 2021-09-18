const { MongoClient } = require('mongodb');

module.exports =
class Users
{
  DAY_IN_SECONDS = 86400;

  constructor(urlBd, dbname)
  {
    this.urlBd = urlBd;
    this.dbname = dbname;
  }

  async getUsersData(name)
  {
    const client = new MongoClient(this.urlBd);

    await client.connect();
    const database = client.db(this.dbname);

    const users = database.collection("users");

    let result = await users.find(
    {
      username: name,
      creationDate:
      {
        $gte: (Date.now() - (this.DAY_IN_SECONDS) / 2),
      }
    }).toArray();

    return result;
  }

  async insertUsersAction(game, name)
  {
    const client = new MongoClient(this.urlBd);

    await client.connect();
    const database = client.db(this.dbname);

    const users = database.collection("users");

    const data = {
      creationDate: Date.now(),
      game: game,
      username: name
    }

      // We insert the game choiced, the real name of the user, the creation date
    const result = await users.insertOne(data);

    client.close();
  }

}