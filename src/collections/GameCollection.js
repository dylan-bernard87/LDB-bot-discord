import { mongoCustomClient, dataBaseName } from '../utils/mongoClient.js';

export default class GameCollection
{
    COLLECTION_NAME = 'game'

    /**
     * @typedef Game
     * @property {string} name
     * @property {string} abbrv
     */

    /**
     * Get all games available in the collection
     *
     * @returns {Array<Game>}
     */
	async getAllGames() {
		await mongoCustomClient.connect();
		const database = mongoCustomClient.db(dataBaseName);
		const collection = database.collection(this.COLLECTION_NAME);

		let result = await collection.find().toArray();

		mongoCustomClient.close();

		return result;
	}

    /**
     * Find a game by his name
     *
     * @param {string} name
     * @returns {Game|null}
     */
	async searchGame(name) {
		await mongoCustomClient.connect();
		const database = mongoCustomClient.db(dataBaseName);
		const collection = database.collection(this.COLLECTION_NAME);

		let game = await collection.findOne({
			$or :
			[
				{ name : new RegExp(`^${name}$`, 'i') },
				{ abbrv: new RegExp(`^${name}$`, 'i') }
			]
		});

		mongoCustomClient.close();

		return game;
	}
}
