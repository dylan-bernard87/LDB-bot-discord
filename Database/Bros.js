const { mongoCustomClient } = require('../Utils/mongoClient.js');
const fs = require('fs');

module.exports =
class Bros
{
	FILE_ERRORS = './Logs/errors.log';

	constructor(dbname) {
		this.dbname = dbname;
	}

	async getLastPlayers(servorName)	{
		await mongoCustomClient.connect();
		const database = mongoCustomClient.db(this.dbname);

		const users = database.collection("bros");

		let result = await users.find({servor: servorName}).limit(1).sort({ creationDate: -1 }).toArray();

		mongoCustomClient.close();

		if (result.length == 1)	return result[0].players;

		return;
	}

	async insertBros(brosList, servorName)	{
		let success = true;
		await mongoCustomClient.connect();
		const database = mongoCustomClient.db(this.dbname);

		const bros = database.collection("bros");

		const data = {
			creationDate: Date.now(),
			players: brosList,
			servor: servorName,
		}

		// We insert an array of string which represent the ids of players/bros
		try {
			const result = await bros.insertOne(data);
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
