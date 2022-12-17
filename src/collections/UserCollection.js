import fs from "fs";
import { mongoCustomClient, dataBaseName } from '../utils/mongoClient.js';

export default class UserCollection
{
    COLLECTION_NAME = 'user'
	DAY_IN_MS = "86400000";
	FILE_ERRORS = 'logs/errors.log';

    /**
     * @typedef {Object} UserShort
     * @property {string} username
     * @property {string} servor
     * @property {number} creationDate
     */

    /**
     * Return the user if he used invoke command too early (delay of 12 hours)
     *
     * @param {String} name
     * @param {String} servorName
     * @returns {UserShort|null}
     */
	async getUserInvokeEarly(username, servorName) {
		await mongoCustomClient.connect();
		const database = mongoCustomClient.db(dataBaseName);
		const collection = database.collection(this.COLLECTION_NAME);

		let user = await collection.findOne({
			username: username,
			servor: servorName,
			creationDate: {
				$gte: (Date.now() - (this.DAY_IN_MS / 2)),
			}
		});

		mongoCustomClient.close();

		return user;
	}

    /**
     * Insert a user in the collection
     *
     * @param {{name: string}} game
     * @param {string} username
     * @param {string} servorName
     * @returns {boolean}
     */
	async insertUsersAction(game, username, servorName)	{
        if (game === null)
            return false;

		await mongoCustomClient.connect();
		const database = mongoCustomClient.db(dataBaseName);
		const users = database.collection(this.COLLECTION_NAME);

        let success = true;

		try {
			await users.insertOne({
                creationDate: Date.now(),
                game: game.name,
                username: username,
                servor: servorName
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
