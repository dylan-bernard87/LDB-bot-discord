const { MongoClient } = require('mongodb');
const fs = require('fs');

module.exports =
class Bros
{
	FILE_ERRORS = './Logs/errors.log';

	constructor(urlBd, dbname)
	{
		this.urlBd = urlBd;
		this.dbname = dbname;
	}

	async getLastPlayers(servorName)	{
		const client = new MongoClient(this.urlBd);

		await client.connect();
		const database = client.db(this.dbname);

		const users = database.collection("bros");

		let result = await users.find({servor: servorName}).limit(1).sort({ creationDate: -1 }).toArray();

		if (result.length == 1)	return result[0].players;

		return;
	}

	async insertBros(brosList, servorName)	{
		let success = true;

		const client = new MongoClient(this.urlBd);

		await client.connect();
		const database = client.db(this.dbname);

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

		client.close();

		return success;
	}
}
