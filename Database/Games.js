const { mongoCustomClient } = require('../Utils/mongoClient.js');

module.exports =
class Games
{
	constructor(dbname) {
		this.dbname = dbname;
	}

	async getAllGames() {
		await mongoCustomClient.connect();
		const database = mongoCustomClient.db(this.dbname);

		const users = database.collection("games");
		let result = await users.find().toArray();

		mongoCustomClient.close();

		console.log(result);

		return result;
	}

	async searchGame(name) {
		await mongoCustomClient.connect();
		const database = mongoCustomClient.db(this.dbname);

		const users = database.collection("games");

		let result = await users.findOne({
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

