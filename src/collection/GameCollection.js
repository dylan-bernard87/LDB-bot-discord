import { mongoCustomClient, dataBaseName } from '../utils/mongoClient.js';

export default class GameCollection
{
    COLLECTION_NAME = 'games'

	async getAllGames() {

		await mongoCustomClient.connect();
		const database = mongoCustomClient.db(dataBaseName);
		const collection = database.collection(this.COLLECTION_NAME);

		let result = await collection.find().toArray();

		mongoCustomClient.close();

		return result;
	}

	async searchGame(name) {
		await mongoCustomClient.connect();
		const database = mongoCustomClient.db(dataBaseName);

		const games = database.collection(this.COLLECTION_NAME);

		let result = await games.findOne({
			$or :
			[
				{ name : new RegExp(`^${name}$`, 'i') },
				{ abbrv: new RegExp(`^${name}$`, 'i') }
			]
		});

		mongoCustomClient.close();

		return result;
	}
}
