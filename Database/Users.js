const { MongoClient } = require('mongodb');

module.exports =
class Users
{
  constructor(urlBd, dbname)
  {
    this.urlBd = urlBd;
    this.dbname = dbname;
  }

  getUsersDate()
  {

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

    console.log(`A document was inserted with the _id: ${result.insertedId}`);
  }

}