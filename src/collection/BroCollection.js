import fs from "fs";
import { mongoCustomClient, dataBaseName } from '../utils/mongoClient.js';

export default class BroCollection
{
    COLLECTION_NAME = 'bros'
	FILE_ERRORS = 'logs/connection.log';

	async getLastPlayers(servorName) {
		await mongoCustomClient.connect();
		const database = mongoCustomClient.db(dataBaseName);

		const users = database.collection(this.COLLECTION_NAME);

		let result = await users.find({servor: servorName}).limit(1).sort({ creationDate: -1 }).toArray();

		mongoCustomClient.close();

		if (result.length == 1)	return result[0].players;

		return;
	}

	async insertBros(brosList, servorName) {
		let success = true;
		await mongoCustomClient.connect();
		const database = mongoCustomClient.db(dataBaseName);

		const bros = database.collection(this.COLLECTION_NAME);

		const data = {
			creationDate: Date.now(),
			players: brosList,
			servor: servorName,
		}

		// Array of string which represent the ids of players/bros
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
