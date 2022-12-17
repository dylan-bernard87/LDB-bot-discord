import fs from "fs";
import { exit } from "process";
import { mongoCustomClient, dataBaseName } from '../utils/mongoClient.js';

export default class BroCollection
{
    COLLECTION_NAME = 'bro'
	FILE_ERRORS = 'logs/connection.log';

    /**
     * Get the most recent 'bro' inserted and return players stored inside
     *
     * @param {string} servorName
     * @returns {Array<string>}
     */
	async getLastPlayers(servorName) {
		await mongoCustomClient.connect();
		const database = mongoCustomClient.db(dataBaseName);
		const collection = database.collection(this.COLLECTION_NAME);

        // NOTE: Can't use findOne with limit
		let bros = await collection
            .find({servor: servorName})
            .limit(1)
            .sort({ creationDate: -1 })
            .toArray();

		mongoCustomClient.close();

        if (bros.length < 1)
            return [];

        const bro = bros[0];

        // Should not happen
        if (bro.players === undefined || bro.players === null)
            return [];

		return bro.players;
	}

    /**
     * Insert list of players in the collection
     *
     * @param {array<string>} brosList : List of the players name id (Ex: <@242703653960478280>)
     * @param {string} servorName
     * @returns {boolean}
     */
	async insertBro(brosList, servorName) {
		await mongoCustomClient.connect();
		const database = mongoCustomClient.db(dataBaseName);
		const collection = database.collection(this.COLLECTION_NAME);

        let success = true;

		try {
			await collection.insertOne({
                creationDate: Date.now(),
                players: brosList,
                servor: servorName,
            });
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
