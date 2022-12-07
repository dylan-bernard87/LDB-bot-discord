const { MongoClient } = require('mongodb');
const fs = require('fs');

module.exports =
class Users
{
	DAY_IN_MS = "86400000";
	FILE_ERRORS = './Logs/errors.log';

	constructor(urlBd, dbname)	{
		this.urlBd = urlBd;
		this.dbname = dbname;
	}

	async getUsersData(name, servorName) {
		const client = new MongoClient(this.urlBd);

		await client.connect();
		const database = client.db(this.dbname);

		const users = database.collection("users");

		let result = await users.find({
			username: name,
			servor: servorName,
			creationDate: {
				$gte: (Date.now() - (this.DAY_IN_MS / 2)),
			}
		}).toArray();

		return result;
	}

	async insertUsersAction(game, name, servorName)	{
		let success = true;

		const client = new MongoClient(this.urlBd);

		await client.connect();
		const database = client.db(this.dbname);

		const users = database.collection("users");

		const data = {
			creationDate: Date.now(),
			game: game.name,
			username: name,
			servor: servorName
		}

		// We insert the game choiced, the real name of the user, the creation date
		try {
			const result = await users.insertOne(data);
		}
		catch (error) {
			success = false;

			let errorMessage = `${error.message} \n`;
			fs.appendFile(this.FILE_ERRORS, errorMessage, function (error) {
				if (error) { return console.log(error); }
			});
		}

		client.close();

		return success;
	}
}
