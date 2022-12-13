const { mongoCustomClient } = require('../Utils/mongoClient.js');
const fs = require('fs');

module.exports =
class Users
{
	DAY_IN_MS = "86400000";
	FILE_ERRORS = './Logs/errors.log';

	constructor(dbname) {
		this.dbname = dbname;
	}

	async getUsersData(name, servorName) {
		await mongoCustomClient.connect();
		const database = mongoCustomClient.db(this.dbname);

		const users = database.collection("users");

		let result = await users.find({
			username: name,
			servor: servorName,
			creationDate: {
				$gte: (Date.now() - (this.DAY_IN_MS / 2)),
			}
		}).toArray();

		mongoCustomClient.close();

		return result;
	}

	async insertUsersAction(game, name, servorName)	{
		let success = true;

		await mongoCustomClient.connect();
		const database = mongoCustomClient.db(this.dbname);

		const users = database.collection("users");

		console.log(game);

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

		mongoCustomClient.close();

		return success;
	}
}
